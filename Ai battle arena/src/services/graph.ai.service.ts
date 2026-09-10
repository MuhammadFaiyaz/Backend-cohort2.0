import { HumanMessage } from "@langchain/core/messages";
import {
    StateSchema,
    MessagesValue,
    ReducedValue,
    StateGraph,
    START,
    END,
} from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { createAgent, providerStrategy } from "langchain";

import { z } from "zod";
import { model_1, model_2, geminiModel } from "./models.service.js";

const State = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next;
        },
    }),
    solution_2: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next;
        },
    }),
    judgeRecommendation: new ReducedValue(
        z.object().default({
            solution_score_1: 0,
            solution_score_2: 0,
        }),
        {
            reducer: (current, next) => {
                return next;
            },
        },
    ),
});

const solutionNode: GraphNode<typeof State> = async (state: typeof State) => {
    const userMessage = state.messages[0]?.content || "No message provided";
    const [model_1_solution, model_2_solution] = await Promise.all([
        model_1.invoke([new HumanMessage(userMessage)]),
        model_2.invoke([new HumanMessage(userMessage)]),
    ]);
    return {
         solution_1: model_1_solution.content || model_1_solution.text || "",
        solution_2: model_2_solution.content || model_2_solution.text || "",
    };
};

const judgeNode: GraphNode<typeof State> = async (state: typeof State) => {
    const { solution_1, solution_2 } = state;
    const judge = createAgent({
        model: geminiModel,
        tools: [],
        responseFormat: providerStrategy(
            z.object({
                solution_score_1: z.number().min(0).max(10),
                solution_score_2: z.number().min(0).max(10),
            }),
        ),
    });

    const judgeRecommendation = await judge.invoke({
        messages: [
            new HumanMessage(
                `You are a judge for a coding competition. 
        You have two solutions to the same problem. 
        The problem is ${state.messages[0]?.content || "No message provided"}. The first solution is: ${solution_1}. 
        The second solution is: ${solution_2}. 
        Please provide a score for each solution between 0 and 10, where 10 is the best possible score. 
        Return your response in the following JSON format: 
        { "solution_score_1": <score_for_solution_1>, "solution_score_2": <score_for_solution_2> }`,
            ),
        ],
    });
    const result = judgeRecommendation.structuredResponse;
    return { judgeRecommendation: result };
};

const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge")
    .addEdge("judge", END)
    .compile();

export default async function (userMessage: string) {
    const result = await graph.invoke({
        messages: [new HumanMessage(userMessage)],
    });
    return {
        messages: result.messages,
        solution_1: result.solution_1,
        solution_2: result.solution_2,
        judgeRecommendation: result.judgeRecommendation,
    };
}

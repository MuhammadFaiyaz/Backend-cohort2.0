import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue, StateGraph, START, END } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { z } from "zod";
import { cohereModel, mistralModel } from "./models.service.js";

const State = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    solution_2: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    judge_recommendation: new ReducedValue(z.object().default({
        solution_score_1: 0,
        solution_score_2: 0

    }), {
        reducer: (current, next) => {
            return next
        }
    })
})

const solutionNode: GraphNode<typeof State> = async (state: typeof State) => {
    const [mistral_solution, cohere_solution] = await Promise.all([
        mistralModel.invoke(state.messages[0].text),
        cohereModel.invoke(state.messages[0].text),
    ])
    return {
        solution_1: mistral_solution.text,
        solution_2: cohere_solution.text
    }
}

const graph = new StateGraph(State).addNode("solution", solutionNode).addEdge(START, "solution").addEdge("solution", END).compile()

export default async function (userMessage: string) {
    const result = await graph.invoke({
        messages: [
            new HumanMessage(userMessage)
        ]
    })
    return result.messages
}

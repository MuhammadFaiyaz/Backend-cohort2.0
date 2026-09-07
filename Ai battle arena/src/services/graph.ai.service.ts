import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue, type GraphNode, StateGraph, START, END } from "@langchain/langgraph";

const State = new StateSchema({
    messages: MessagesValue
})

const solutionNode: GraphNode<typeof State> = (state: typeof State) => {
    console.log(state.messages);
}

const graph = new StateGraph(State).addNode("solution", solutionNode).addEdge(START, "solution").compile()

export default async function (userMessage: string) {
    const result = await graph.invoke({
        messages: [
            new HumanMessage(userMessage)
        ]
    })

    return result.messages
}
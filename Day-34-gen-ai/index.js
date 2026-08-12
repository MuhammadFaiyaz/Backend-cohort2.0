import readline from 'readline/promises';
import 'dotenv/config';
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, tool, createAgent } from "langchain"
import * as z from "zod"
import { sendEmail } from './mail.service.js';
import { searchWeb, extractContent } from './tavily.service.js';

const searchTool = tool(
    searchWeb, {
    name: "search_web",
    description: "Search the web for real-time information, news, or up-to-date data. Use this when the user asks about current events, recent developments, or any topic that might require fresh information.",
    schema: z.object({
        query: z.string().describe("The search query to look up on the web"),
        searchDepth: z.enum(["basic", "advanced"]).optional().default("basic")
            .describe("'basic' for quick searches, 'advanced' for comprehensive research"),
        maxResults: z.number().optional().default(5)
            .describe("Number of search results to return (1-10)"),
    })
}
)

const emailTool = tool(
    sendEmail,
    {
        name: "emailTool",
        description: "Use this tool to send emails.",
        schema: z.object({
            to: z.string().describe("The recipient's email address."),
            subject: z.string().describe("The subject of the email."),
            html: z.string().describe("The HTML content of the email."),
        })
    }
)

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const model = new ChatMistralAI({
    model: "mistral-small-latest",
    temperature: 0.3,
})

const agent = createAgent({
    model, tools: [searchTool, emailTool], systemPrompt: `You are a Perplexity-style research assistant. Your goal is to provide 
    accurate, well-researched answers using real-time web data. When asked about recent events 
    or topics you're unsure about, use the search_web tool. When the user wants to send an 
    email, use the emailTool. Always cite your sources and provide balanced, factual information.`
})

const messages = [];


while (true) {
    const userInput = await rl.question("\x1b[32mYou:\x1b[0m ");
    messages.push(new HumanMessage(userInput))

    const response = await agent.invoke({ messages });
    messages.push(response.messages[response.messages.length - 1]);
    console.log(response);

    console.log(`\x1b[34m[AI]\x1b[0m ${response.content}`)
}

rl.close()
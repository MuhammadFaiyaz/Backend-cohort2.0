import readline from 'readline/promises';
import 'dotenv/config';
import { HumanMessage } from "langchain";
import mistralService from "../services/ai.service.js"
import { searchTool, emailTool } from '../tools/index.js';



const SYSTEM_PROMPT = `You are a Mistral-style research assistant. Your goal is to provide 
accurate, well-researched answers using real-time web data. When asked about recent events 
or topics you're unsure about, use the search_web tool. When the user wants to send an 
email, use the emailTool. Always cite your sources and provide balanced, factual information.`;

async function startAgent() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log("\x1b[36m🤖 Mistral AI Agent Started\x1b[0m");
    console.log("\x1b[33mType your questions or 'exit' to quit\x1b[0m\n");

    const agent = await mistralService.createAgent(
        [searchTool, emailTool],
        SYSTEM_PROMPT
    );

    const messages = [];

    while (true) {
        const userInput = await rl.question("\x1b[32mYou:\x1b[0m ");
        if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
            console.log("\x1b[36mGoodbye! 👋\x1b[0m");
            rl.close()
            break;
        }
        messages.push(new HumanMessage(userInput));

        try {
            const response = await agent.invoke({ messages });
            const lastMessage = response.messages[response.messages.length - 1]
            const content = lastMessage?.content || response.content || "No response";
            messages.push(lastMessage);

            console.log(`\x1b[34mAI:\x1b[0m ${content}\n`);
        } catch (error) {
            console.error("\x1b[31mError:\x1b[0m", error.message);
        }
    }


}

startAgent()
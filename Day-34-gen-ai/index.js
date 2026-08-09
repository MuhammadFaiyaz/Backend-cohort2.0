import readline from 'readline/promises';
import 'dotenv/config';
// dotenv.config();
import { ChatMistralAI } from "@langchain/mistralai"
import {HumanMessage} from "langchain"

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });



const model = new ChatMistralAI({
    model: "mistral-small-latest",
})

const messages = [];


while (true) {
    const userInput = await rl.question("\x1b[32mYou:\x1b[0m ");
    messages.push(new HumanMessage(userInput))

    const response = await model.invoke(messages);
    messages.push(response)
    console.log(`\x1b[34m[AI]\x1b[0m ${response.content}`)


}
feat: initialize backend with user authentication and email verification

- Added package.json for backend dependencies and scripts
- Created server.js to set up Express server and connect to MongoDB
- Implemented app.js to configure middleware and routes
- Developed user authentication controller with register, login, and email verification functionalities
- Added middleware for user  
- Added AI service for testing Google Generative AI model

rl.close()
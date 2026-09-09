import { ChatGoogle } from "@langchain/google";
import { ChatGroq } from "@langchain/groq";
import app_config from "../config/config.js";


const geminiModel = new ChatGoogle({
    model: "gemini-3.7-flash",
    apiKey: app_config.GOOGLE_API_KEY,
});

const model_1 = new ChatGroq({
    model: "openai/gpt-oss-20b",
    apiKey: app_config.GROQ_API_KEY
    
})

const model_2 = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: app_config.GROQ_API_KEY

})

export { geminiModel, model_1, model_2 }
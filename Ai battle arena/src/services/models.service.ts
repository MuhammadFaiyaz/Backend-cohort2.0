import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai"
import { ChatCohere } from "@langchain/cohere"
import config from "../config/config.js";


const geminiModel = new ChatGoogle({
    model: "gemini-3.7-flash",
    apiKey: config.GOOGLE_API_KEY,
});

const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY
    
})

const cohereModel = new ChatCohere({
    model: "command-r-plus",
    apiKey: config.COHERE_API_KEY

})
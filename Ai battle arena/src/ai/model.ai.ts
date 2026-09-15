import { ChatGoogle } from "@langchain/google";
import { ChatCohere } from "@langchain/cohere";
import config from "../config/config.js"

export const geminiModel = new ChatGoogle({
  model: "gemini-3.6-flash",
  apiKey: config.GOOGLE_API_KEY
})

export const model_1 = new ChatGoogle({
  model: "gemini-3.5-flash-lite",
  apiKey: config.GOOGLE_API_KEY
})

export const model_2 = new ChatCohere({
  model: "command-a-03-2025",
  apiKey: config.COHERE_API_KEY
})
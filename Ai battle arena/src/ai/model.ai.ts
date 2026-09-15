import { ChatGoogle } from "@langchain/google";
import { ChatGroq } from "@langchain/groq";
import config from "../config/config.js"

export const geminiModel = new ChatGoogle({
  model: "gemini-2.5-flash-lite",
  apiKey: config.GOOGLE_API_KEY
})

export const model_1 = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: config.GOOGLE_API_KEY
})

export const model_2 = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: config.GROQ_API_KEY
})
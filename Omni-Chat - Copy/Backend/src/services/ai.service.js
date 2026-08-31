import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent } from "langchain";
import { tools } from "../tools/index.js";
import 'dotenv/config';

class MistralService {
  constructor() {
    this.model = new ChatMistralAI({
      model: "mistral-small-latest",
      temperature: 0.3,
      apiKey: process.env.MISTRAL_API_KEY,
    })
    this.agent = createAgent({
      model: this.model,
      tools,
      systemPrompt: "Use the search_web tool for current information, news, websites, or social media. Cite the sources in your answer.",
    })
  }
  async sendPrompt(prompt, options = {}) {
    try {
      const response = await this.agent.invoke({ messages: prompt }, options);
      return response.messages[response.messages.length - 1];
    } catch (error) {
      console.error("Mistral query error:", error);
      throw error;
    }
  }

  async generateTitle(message) {
    const response = await this.model.invoke(`
      Create a short title for this chat based on the user's message.
Return only the title, without quotes or markdown.
Keep it under 40 characters.

User message: ${message}
      `)

      return response.content.trim() || "New Chat"
  }

  async createAgent(tools = [], systemPrompt = '') {
    return createAgent({
      model: this.model,
      tools,
      systemPrompt
    })
  }

  async streamQuery(prompt, callback) {
    const stream = await this.model.stream(prompt);
    for await (const chunk of stream) return callback(chunk);
  }
}

export default new MistralService();
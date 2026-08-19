import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent } from "langchain";
import 'dotenv/config';

class MistralService {
  constructor() {
    this.model = new ChatMistralAI({
      model: "mistral-small-latest",
      temperature: 0.3,
      apiKey: process.env.MISTRAL_API_KEY,
    })
  }
  async sendPrompt(prompt, options = {}) {
    try {
      const response = await this.model.invoke(prompt, options);
      return response;
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
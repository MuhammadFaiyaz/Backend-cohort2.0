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
  async invoke(prompt, options = {}) {
    try {
      const response = await this.model.invoke(prompt);
      return response;
    } catch (error) {
      console.error("Mistral query error:", error);
      throw error;
    }
  }

  async createAgent(tools=[], systemPrompt = '') {
    return createAgent({
      model: this.model,
      tools, 
      systemPrompt
    })
  }

  async streamQuery(prompt, callback) {
    const stream = await this.model.stream(prompt);
    for await(const chunk of stream) return callback(chunk);
  }
}

export default new MistralService();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function testAi() {
    model.invoke("What is langchain tell me in bangla?").then((response) => {
        console.log(response.text);
    });
}
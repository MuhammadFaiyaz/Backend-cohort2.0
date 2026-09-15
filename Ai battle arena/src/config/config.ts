import dotenv from "dotenv";
dotenv.config();


const config = {
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY|| "",
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY|| "",
  GROQ_API_KEY: process.env.GROQ_API_KEY|| ""
}

export default config;
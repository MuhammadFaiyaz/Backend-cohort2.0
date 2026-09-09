import dotenv from "dotenv";
dotenv.config();

type CONFIG = {
    readonly GOOGLE_API_KEY: string,
    readonly GROQ_API_KEY: string,
}

const app_config: CONFIG ={
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY||"",
    GROQ_API_KEY: process.env.GROQ_API_KEY||"",
}

export default app_config
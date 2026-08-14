import { tool } from "langchain";
import * as z from "zod";
import { sendEmail } from "../services/mail.service.js";
import { searchWeb } from "../services/tavily.service.js";


export const searchTool = tool(
    searchWeb, {
        name: "search_web",
        description: "Search the web for real-time information, news, or up-to-date data.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the web"),
            searchDepth: z.enum(["basic", "advanced"]).optional().default("basic"),
            maxResults: z.number().optional().default(5),
        })
    }
);

export const emailTool = tool(
    sendEmail,
    {
        name: "emailTool",
        description: "Use this tool to send emails.",
        schema: z.object({
            to: z.string().describe("The recipient's email address."),
            subject: z.string().describe("The subject of the email."),
            html: z.string().describe("The HTML content of the email."),
        })
    }
)

export const tools = [searchTool, emailTool];
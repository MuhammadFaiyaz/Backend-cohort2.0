import { tavily } from 'tavily';
import dotenv from 'dotenv';
dotenv.config();

const tavilyClient =  tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function searchWeb({ query, searchDepth = "basic", maxResults = 5 }) {
    try {
        const response = await tavilyClient.search(query, {
            searchDepth, maxResults, includeImages: false,
            includeAnswer: true,
            includeRawContent: false,
        })

        console.log(`🔍 Searched for: "${query}"`);
        return response;
    } catch (error) {
        console.error('Tavily search failed:', error);
        throw new Error(`Search failed: ${error.message}`);
    }
}

export async function extractContent({ urls }) {
    try {
        const response = await tavilyClient.extract(urls);
        return response;
    } catch (error) {
        console.error('Tavily content extraction failed:', error);
        throw error;
    }
}

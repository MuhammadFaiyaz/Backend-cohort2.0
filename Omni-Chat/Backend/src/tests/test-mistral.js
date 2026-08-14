import mistralService from '../services/mistralService';



export async function testMistral() {
    try {
        const response = await mistralService.invoke("What is LangChain? Tell me in simple terms.");
        console.log("Response: ", response.content);
    } catch (error) {
        console.error("Test failed:", error);
    }
}
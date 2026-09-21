import axios from "axios";

const API_BASE = "http://localhost:3000"; // Replace with your backend URL
const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 120 seconds timeout
  headers: {
    "Content-Type" : "application/json"
  }
})


/**
 * Simulates calling the AI models + judge with a delay.
 * Replace this with real API calls when backend is ready.
 */
export async function simulateBattleResponse(userMessage) {
  try {
    const response = await api.post("/invoke", {
      problem: userMessage,
    })

    console.log(response.data);
    return response.data.data
  } catch (err) {
    const msg = err.response?.data?.error || err.message || "Unknown error";
    console.error("Error invoking AI models:", msg);
    throw new Error(msg);
  }
}

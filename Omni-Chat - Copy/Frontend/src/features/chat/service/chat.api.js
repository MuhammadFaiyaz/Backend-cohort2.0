import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/chats",
    withCredentials: true
});

export async function sendMessage({ chatId, message }) {
    const response = await api.post("/messages", { chatId, message });
    return response.data
}

export async function getChatHistory() {
    const response = await api.get("/");
    return response.data;
}

// Get messages for a specific chat
export async function getChatMessages(chatId) {
    const response = await api.get(`/${chatId}/messages`);
    return response.data;
}

export async function createNewChat() {
    const response = await api.post("/create");
    return response.data;
}

export async function deleteChat(chatId) {
    const response = await api.delete(`/${chatId}`);
    return response.data;
}

// Update chat title
export async function updateChatTitle(chatId, title) {
    const response = await api.patch(`/${chatId}/title`, { title });
    return response.data;
}
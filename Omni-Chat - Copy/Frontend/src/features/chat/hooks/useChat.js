import { initializeSocketConnection } from "../service/chat.socket";

export function useChat() {
    return { initializeSocketConnection }
}
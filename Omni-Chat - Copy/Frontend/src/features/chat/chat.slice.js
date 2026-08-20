import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: [],
        activeChat: null,
        messages: [],
        loading: false,
        error: null,
        isTyping: false,
        socket: null,
        unreadCount: 0,
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setTyping: (state, action) => {
            state.isTyping = action.payload;
        },
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateMessageStatus: (state, action) => {
            const { tempId, status } = action.payload;
            const msg = state.messages.find(m => m.tempId === tempId)
            if (msg) msg.status = status
        },
        removeTempMessage: (state, action) => {
            state.messages = state.messages.filter(m => m.tempId != action.payload)
        }
    }
})

export const { chats, activeChat, messages, loading, error, isTyping, socket, unreadCount } = chatSlice.actions
export default chatSlice.reducer;
import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage as sendMessageAPI, getChatHistory, getChatMessages, createNewChat, updateChatTitle, deleteChat } from "../service/chat.api.js";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { addMessage, removeTempMessage, setActiveChat, setError, setLoading, setMessages, setChats, setTyping } from "../chat.slice.js";

export function useChat() {
    const dispatch = useDispatch();
    const socketRef = useRef();
    const { user } = useSelector(state => state.auth);
    const { activeChat } = useSelector(state => state.chat);

    // Initialize Socket
    const initializeSocket = useCallback(() => {
        if (socketRef.current?.connected) return;

        const socket = io("http://localhost:3000", {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            autoConnect: true
        })
        socket.on("connect", () => {
            console.log(socket.connected); // true
        });

        socket.on("disconnect", () => {
            console.log(socket.connected); // false
        });

        socket.on("message-received", (data) => {
            dispatch(addMessage(data))
        })
        socket.on("typing", (data) => {
            dispatch(setTyping(data.isTyping))
        })

        socketRef.current = socket;

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, [dispatch])

    // Load chat history
    const loadChatHistory = useCallback(async () => {
        try {
            dispatch(setLoading(true))
            const data = await getChatHistory()
            dispatch(setChats(data.chats || []))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to load chat history"))
        } finally {
            dispatch(setLoading(false))

        }
    }, [dispatch])

    // Load messages for a specific chat
    const loadChatMessages = useCallback(async (chatId) => {
        try {
            dispatch(setLoading(true))
            const data = await getChatMessages(chatId)
            dispatch(setActiveChat(data.chat))
            dispatch(setMessages(data.messages || []))

            if (socketRef.current) socketRef.current.emit("join-chat", chatId)

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to load messages"))
        } finally {
            dispatch(setLoading(false))

        }
    }, [dispatch])

    // Send message
    const sendMessage = useCallback(async ({ chatId, message }) => {
        if (!message.trim()) {
            dispatch(setError("Message can't be empty."))
            return;
        }

        try {
            // Optimistic update
            const targetChatId = chatId || activeChat?._id;

            const tempId = `temp-${Date.now()}`;
            const tempMessage = {
                tempId,
                chat: targetChatId,
                messageContent: message.trim(),
                role: "user",
                status: "sending",
                createdAt: new Date().toISOString()
            }
            dispatch(addMessage(tempMessage))

            // Send to API
            const response = await sendMessageAPI({
                chatId: targetChatId,
                message: message.trim()
            })

            dispatch(removeTempMessage(tempId))  // Remove temp message
            dispatch(addMessage(response.userMessage)) // Add user's msg
            dispatch(addMessage(response.aiMessage))  // AI's response

            dispatch(setActiveChat({ _id: response.chatId, title: response.title }))
            if(!chatId || response.title !== activeChat._id){
                await loadChatHistory()
            }

            return response
        } catch (error) {
            console.error("sendMessage error:", error);
            dispatch(setError(error.response?.data?.message || "Failed to send message"));
        }
    }, [dispatch, activeChat, loadChatHistory])

    // Create new chat
    const createChat = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const data = await createNewChat()
            dispatch(setActiveChat(data.chat))
            dispatch(setMessages([]))
            await loadChatHistory();
            return data.chat;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to create chat"));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, loadChatHistory])

    // Delete chat
    const removeChat = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            await deleteChat(chatId);
            await loadChatHistory();
            if (activeChat._id === chatId) {
                dispatch(setActiveChat(null))
                dispatch(setMessages([]))
            }
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to delete chat"));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, loadChatHistory, activeChat])

    // Clear error 
    const clearError = useCallback(() => {
        dispatch(clearError())
    }, [dispatch])

    // Initialize on mount (only if user is authenticated)
    useEffect(() => {
        if (user) {
            initializeSocket()
            loadChatHistory()
        }
    }, [initializeSocket, loadChatHistory, user])

    // clear mount
    useEffect(() => {
        return () => {

            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null;
            }
        }
    }, [])

    return {
        chats: useSelector(state => state.chat.chats),
        activeChat: useSelector(state => state.chat.activeChat),
        messages: useSelector(state => state.chat.messages),
        loading: useSelector(state => state.chat.loading),
        error: useSelector(state => state.chat.error),
        isTyping: useSelector(state => state.chat.isTyping),
        socket: useSelector(state => state.chat.socket),
        unreadCount: useSelector(state => state.chat.unreadCount),

        initializeSocket,
        loadChatHistory,
        loadChatMessages,
        sendMessage,
        createChat,
        removeChat,
        clearError,
    }
}
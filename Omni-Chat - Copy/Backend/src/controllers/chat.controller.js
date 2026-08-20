import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import aiService from "../services/ai.service.js";

const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id)
}

export async function sendMessage(req, res) {

    try {
        const { chatId, message } = req.body
        const trimmedMessage = message?.trim()

        if (!trimmedMessage) return res.status(400).json({ message: "Message is required" })


        if (chatId && !isValidObjectId(chatId)) return res.status(400).json({ message: "Invalid chat ID format" })

        let chat = chatId ? await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        }) : null;

        if (chatId && !chat) return res.status(404).json({ message: "Chat not found" });

        if (!chat) chat = await chatModel.create({ user: req.user.id })

        const firstMessage = (await messageModel.countDocuments({ chat: chat._id })) === 0;
        if (firstMessage) {
            chat.title = await aiService.generateTitle(trimmedMessage);
            await chat.save();
        }

        const previousMessage = await messageModel.find({ chat: chat._id }).sort({ createdAt: 1 }).select("role messageContent -_id")

        const conversation = [...previousMessage.map((item) => (
            {
                role: item.role === "user" ? "user" : "ai",
                content: item.messageContent
            }
        )), { role: "user", content: trimmedMessage }
        ]

        const response = await aiService.sendPrompt(conversation)

        await messageModel.create([
            {
                chat: chat._id,
                messageContent: trimmedMessage,
                role: "user"
            },
            {
                chat: chat._id,
                messageContent: response.content,
                role: "ai"
            }
        ])

        res.json({
            chatId: chat._id,
            title: chat.title,
            response: response.content,
        });
    } catch (error) {
        console.error("Chat message error:", error);
        res.status(500).json({ message: "Failed to process chat message" });
    }

}

export async function getChatHistory(req, res) {
    try {
        const chats = await chatModel.find({ user: req.user.id }).sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            chats
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function getChatMessages(req, res) {
    try {
        const chat = await chatModel.findOne({
            _id: req.params.chatId,
            user: req.user.id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        const messages = await messageModel.find({ chat: chat._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            chat,
            messages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function createNewChat(req, res) {
    try {
        const chat = await chatModel.create({
            user: req.user.id,
            title: "New Chat",
        })

        res.status(201).json({
            success: true,
            chat: {
                _id: chat._id,
                title: chat.title,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
            },
            message: "New chat created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create new chat"
        });
    }
}

export async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;
        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found or you don't have permission to delete it"
            });
        }

        // Delete all messages in this chat first
        await messageModel.deleteMany({ chat: chatId })

        // Then delete the chat itself
        await chatModel.findByIdAndDelete(chat)
        res.status(200).json({
            success: true,
            message: "Chat and all associated messages deleted successfully",
            deletedChatId: chatId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete chat"
        });
    }
}

export async function updateChat(req, res) {
    try {
        const { chatId } = req.params
        const { title } = req.body

        // if user tries to update title with whitespace
        if (!title.trim()) return res.status(400).json({
            success: false,
            message: "Title is required"
        });

        // Validate ObjectId format
        const isValidObjectId = (id) => {
            return /^[0-9a-fA-F]{24}$/.test(id);
        };

        if (!isValidObjectId) return res.status(400).json({
            success: false,
            message: "Invalid chat ID format"
        });

        const chat = await chatModel.findOneAndUpdate(
            {
                _id: chatId,
                user: req.user.id
            }, { title: title.trim() },
            {
                new: true,
                runValidators: true
            })

        // Check if chat exists
        if (!chat) return res.status(404).json({
            success: false,
            message: "Chat not found or you don't have permission to update it"
        });

        res.status(200).json({
            success: true,
            chat: {
                _id: chat._id,
                title: chat.title,
                updatedAt: chat.updatedAt
            },
            message: "Chat title updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update chat title"
        });
    }
}
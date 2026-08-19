import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function getChatHistory(req, res) {
    const chats = await chatModel.find({ user: req.user.id }).sort({ updatedAt: -1 });

    res.json({ chats })
}

export async function getChatMessages(req, res) {
    const chat = await chatModel.find({
        _id: req.params.chatId,
        user: req.user.id
    })
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const messages = await messageModel.find({chat: chat._id}).sort({updatedAt: -1});

    res.json({chat, messages})
}
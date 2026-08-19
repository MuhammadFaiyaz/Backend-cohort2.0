import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import aiService from "../services/ai.service.js";

const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id)
}

export async function sendMessage(req, res) {

    try {
        const { message, chatId } = req.body
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
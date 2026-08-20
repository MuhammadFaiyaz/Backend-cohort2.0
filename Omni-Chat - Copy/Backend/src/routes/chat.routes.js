import { Router } from "express";
import {
    sendMessage ,
    getChatHistory ,
    getChatMessages ,
    createNewChat ,
    deleteChat ,
    updateChat 
} from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js"

const chatRouter = Router();

chatRouter.post("/create", authUser, createNewChat )
chatRouter.get("/", authUser, getChatHistory );
chatRouter.post("/messages", authUser, sendMessage );
chatRouter.get("/:chatId/messages", authUser, getChatMessages );
chatRouter.patch("/:chatId/title", authUser, updateChat )
chatRouter.delete("/:chatId", authUser, deleteChat )


export default chatRouter
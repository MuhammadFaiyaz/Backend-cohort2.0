import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { getChatHistory, getChatMessages } from "../controllers/history.controller.js";

const historyRouter = Router();

historyRouter.get("/", authUser, getChatHistory)
historyRouter.get("/:chatId/messages", authUser, getChatMessages)

export default historyRouter;
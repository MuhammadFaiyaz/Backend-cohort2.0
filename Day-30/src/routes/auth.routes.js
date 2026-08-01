import { Router } from "express";
const authRouter = Router();
import { registerUser } from "../controller/auth.controller.js";

authRouter.post("/register", registerUser)

export default authRouter;
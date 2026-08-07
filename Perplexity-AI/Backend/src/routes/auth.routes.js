import {Router} from "express";
import { register, login, verifyEmail, getMe } from "../controllers/auth.controller.js";
import {authUser} from "../middleware/auth.middleware.js"
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, register);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/login", loginValidator, login);
authRouter.get("/get-me", authUser, getMe);
export default authRouter;

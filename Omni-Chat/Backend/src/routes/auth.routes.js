import { Router } from "express";
import { registerValidation, loginValidation } from "../validators/auth.validator.js";
import { registerController, verifyEmail, loginController, getMeController } from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();


authRouter.post("/register", registerValidation, registerController);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/login", loginValidation, loginController);
authRouter.post("get-me", authUser, getMeController)

export default authRouter;

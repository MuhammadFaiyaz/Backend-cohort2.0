import { Router } from "express";
import { registerValidation, loginValidation } from "../validators/auth.validator.js";
import { registerController, verifyEmail, loginController, getMeController, logoutController} from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();


authRouter.post("/register", registerValidation, registerController);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/login", loginValidation, loginController);
authRouter.get("/get-me", authUser, getMeController)
authRouter.post("/logout", authUser, logoutController)

export default authRouter;

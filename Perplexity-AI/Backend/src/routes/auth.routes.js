import {Router} from "express";
import { register, login } from "../controllers/auth.controller.js";
import {authUser} from "../middleware/auth.middleware.js"
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);

export default authRouter;

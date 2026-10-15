import {Router} from "express";
import { validateRegister, validateLogin } from "../validator/auth.validator.js";
import { login, register } from "../controllers/auth.controller.js";
const authRouter = Router();

authRouter.post("/register", validateRegister, register );
authRouter.post("/login", validateLogin, login);

export default authRouter;
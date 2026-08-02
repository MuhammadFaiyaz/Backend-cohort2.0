import { Router } from "express";
const authRouter = Router();
import { registerUser } from "../controller/auth.controller.js";
import { registerUserValidation } from "../validator/auth.validator.js";

authRouter.post("/register", registerUserValidation, registerUser)

export default authRouter;
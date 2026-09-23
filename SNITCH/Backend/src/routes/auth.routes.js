import {Router} from "express";
import { validateRegister } from "../validator/auth.validator.js";
import { register } from "../controllers/auth.controller.js";
const authRouter = Router();

authRouter.post("/register", validateRegister, register );
// authRouter.get("/login", );

export default authRouter;
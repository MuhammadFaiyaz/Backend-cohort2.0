import {Router} from "express";
import { validateRegister } from "../validator/auth.validator.js";

const authRouter = Router();

authRouter.get("/register", validateRegister );
// authRouter.get("/login", );

export default authRouter;
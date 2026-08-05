import express from "express";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

import {
  registerController,
  loginController,
  logoutController,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, registerController);
authRouter.post("/login", loginValidator, loginController);
authRouter.post("/logout", logoutController);

export default authRouter;
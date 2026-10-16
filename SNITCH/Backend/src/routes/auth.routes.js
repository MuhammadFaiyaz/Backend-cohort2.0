import { Router } from "express";
import { validateRegister, validateLogin } from "../validator/auth.validator.js";
import { login, register, googleAuthCallback } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";

const authRouter = Router();

authRouter.post("/register", validateRegister, register);
authRouter.post("/login", validateLogin, login);

// Route to initiate Google OAuth flow
authRouter.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route that Google will redirect to after authentication
authRouter.get("/google/callback",
  passport.authenticate('google', {
    session: false,
    failureRedirect: config.NODE_ENV === 'development' ? 'http://localhost:5173/login' : '/login'
  }),
  googleAuthCallback
);


export default authRouter;
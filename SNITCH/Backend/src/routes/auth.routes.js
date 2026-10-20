import { Router } from "express";
import { validateRegister, validateLogin } from "../validator/auth.validator.js";
import { login, register, googleAuthCallback, getMe } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import passport from "passport";
import { config } from "../config/config.js";

const authRouter = Router();
/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", validateRegister, register);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login", validateLogin, login);

/**
 * @route GET /api/auth/google
 * @desc Initiate Google OAuth2 login
 * @access Public
 */
authRouter.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @route GET /api/auth/google/callback
 * @desc Handle Google OAuth2 callback
 * @access Public
 */
authRouter.get("/google/callback",
  passport.authenticate('google', {
    session: false,
    failureRedirect: config.NODE_ENV === 'development' ? 'http://localhost:5173/login' : '/login'
  }),
  googleAuthCallback
);

/**
 * @route GET /api/auth/me
 * @desc Get the currently authenticated user
 * @access Private
 */
authRouter.get("/me", authenticateUser, getMe);


export default authRouter;
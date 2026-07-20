const express = require("express");
const authUser = require("../middlewares/auth.middleware");
const {
  registerController,
  loginController,
  getMeController,
  logoutController,
} = require("../controllers/auth.controller");
const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/get-me", authUser, getMeController);
authRouter.post("/logout", logoutController);

module.exports = authRouter;

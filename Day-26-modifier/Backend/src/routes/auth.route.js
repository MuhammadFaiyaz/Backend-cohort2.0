const express = require("express");
const authRouter = express.Router();
const {
  registerController,
  loginController,
  getMeController,
  logoutController,
} = require("../controllers/auth.controller");
const authUser = require("../middleware/auth.middleware");

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/get-me", authUser, getMeController);
authRouter.post("/logout", authUser, logoutController);

module.exports = authRouter;

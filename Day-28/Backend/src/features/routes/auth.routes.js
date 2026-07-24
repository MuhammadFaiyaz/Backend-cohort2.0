const express = require("express");
const { registerController, loginController } = require("../controllers/auth.controller");
const authUser = require("../middlewares/auth.middleware");
const authRouter = express.Router();

authRouter.post("/register", registerController)
authRouter.post("/login", loginController)
authRouter.get("/get-me", authUser ,loginController)

module.exports = authRouter;
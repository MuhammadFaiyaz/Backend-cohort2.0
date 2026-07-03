const express = require("express");
const userRouter = express.Router();
const { followUserController, unfollowUserController } = require("../controllers/user.controller");
const identifyUser = require("../middlewares/auth.middleware");

userRouter.post("/follow/:username", identifyUser, followUserController)
userRouter.post("/unfollow/:username", identifyUser, unfollowUserController)

module.exports = userRouter;
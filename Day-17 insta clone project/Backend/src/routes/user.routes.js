const express = require("express");
const identifyUser = require("../middlewares/auth.middleware");
const {followUserController, unfollowUserController} = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.post("/follow/:username", identifyUser, followUserController)
userRouter.post("/unfollow/:username", identifyUser, unfollowUserController)

module.exports = userRouter;
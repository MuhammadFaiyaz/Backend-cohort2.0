const express = require("express");
const userRouter = express.Router();
const { followUserController, unfollowUserController } = require("../controllers/user.controller");
const identifyUser = require("../middlewares/auth.middleware");

userRouter.post("/follow", identifyUser, followUserController)
userRouter.post("/unfollow", identifyUser, unfollowUserController)
module.exports = userRouter;
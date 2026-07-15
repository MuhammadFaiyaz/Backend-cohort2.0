const express = require("express");
const followRouter = express.Router();
const identifyUser = require("../middlewares/auth.middleware");
const { getFollowersController, getFollowingsController, getSuggestedUsersController } = require("../controllers/follow.controller");

followRouter.get("/followers", identifyUser, getFollowersController)
followRouter.get("/following", identifyUser, getFollowingsController)
followRouter.get("/suggested", identifyUser, getSuggestedUsersController)


module.exports = followRouter

const express = require("express");
const identifyUser = require("../middlewares/auth.middleware");
const { acceptFollowRequestController, rejectFollowRequestController } = require("../controllers/follow.controller");
const followRouter = express.Router();


followRouter.patch("/:requestId/accept", identifyUser, acceptFollowRequestController)
followRouter.patch("/:requestId/reject", identifyUser, rejectFollowRequestController)

module.exports = followRouter;
const {createPostController, getPostController, getPostDeatailsController} = require("../controller/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const express = require("express");
const postRouter = express();

postRouter.post("/", upload.single("image"),createPostController);
postRouter.get("/", getPostController);
postRouter.get("/details/:postId", getPostDeatailsController);

module.exports = postRouter;

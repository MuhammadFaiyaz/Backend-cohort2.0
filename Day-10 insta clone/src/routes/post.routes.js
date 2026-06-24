const {createPostController} = require("../controller/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const express = require("express");
const postRouter = express();

postRouter.post("/", upload.single("image"),createPostController);

module.exports = postRouter;

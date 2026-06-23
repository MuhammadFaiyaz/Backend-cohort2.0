const express = require("express");
const postRouter = express.Router();
const { createPostController } = require("../controller/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() })


postRouter.post("/", upload.single("image"), createPostController)

module.exports = postRouter
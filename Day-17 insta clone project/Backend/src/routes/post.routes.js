const express = require("express");
const postRouter = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  createPostController,
  getPostController,
  getPostDeatailsController,
} = require("../controllers/post.controller");
const identifyUser = require("../middlewares/auth.middleware");

postRouter.post(
  "/",
  identifyUser,
  upload.single("image"),
  createPostController,
);
postRouter.get("/", identifyUser, getPostController);
postRouter.get("/details/:id", identifyUser, getPostDeatailsController);

module.exports = postRouter;

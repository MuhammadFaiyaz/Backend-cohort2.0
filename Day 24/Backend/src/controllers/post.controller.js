const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const likeModel = require("../models/like.model");
const { default: mongoose } = require("mongoose");

const client = new ImageKit({
  privateKey: process.env["IMAGEKIT_PRIVATE_KEY"],
});

const createPostController = async (req, res) => {
  const file = await client.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "test",
    folder: "cohort-2-insta-clone-post",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    img_url: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post created sucessfully",
    post,
  });
};

const getPostController = async (req, res) => {
  userId = req.user.id;
  posts = await postModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "Post fetched sucessfully.",
  });
};

const getPostDeatailsController = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const post = await postModel.findById(postId);

  if (!post)
    return res.status(404).json({
      message: "Post not found.",
    });

  const isValidUser = post.user.toString() === userId;
  if (!isValidUser)
    return res.status(403).json({
      message: "Forbidden content.",
    });
  res.status(200).json({
    message: "Posts fetched successfully",
    post,
  });
};

const getFeedController = async (req, res) => {
  const postData = await postModel.find({}).populate("user").lean();

  const posts = await Promise.all(
    postData.map(async (post) => {
      const isLiked = await likeModel.findOne({
        user: req.user.username,
        post: post._id,
      });

      post.isLiked = Boolean(isLiked);

      return post;
    }),
  );

  res.status(200).json({
    message: "Post fetched sucessfully.",
    posts,
  });
};

const getLikeController = async (req,res) => {
  const username = req.user.username;
  const postId = req.params.postId;

  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(404).json({
      message: "Invalid post ID",
    });

  const post = await postModel.findById(postId);
  if (!post)
    return res.status(404).json({
      message: "Post not found",
    });

  const like = await likeModel.create({
    user: username,
    post: postId,
  });

  res.status(200).json({
    message: "Post liked successfully.",
    like,
  });
};
const getUnlikeController = async (req,res) => {
  const username = req.user.username;
  const postId = req.params.postId;

  const isLiked = await likeModel.findOne({
    user: username,
    post: postId,
  });

  if (!isLiked)
    return res.status(400).json({
      message: "post didn't like",
    });

  await likeModel.findOneAndDelete({ _id: isLiked._id });
  return res.status(200).json({
    message: "post is unlike successfully",
  });
};
module.exports = {
  createPostController,
  getPostController,
  getPostDeatailsController,
  getFeedController,
  getLikeController,
  getUnlikeController,
};

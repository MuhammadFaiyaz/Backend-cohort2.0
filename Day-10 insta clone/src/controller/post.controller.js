const postModel = require("../model/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");

const imageKit = new ImageKit({
  privateKey: process.env["IMAGEKIT_PRIVATE_KEY"],
});

const createPostController = async (req, res) => {
  console.log(req.body, req.file);

  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      message: "Unauthorized",
    });

  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      message: "unauthorized user",
    });
  }

  const file = await imageKit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "cohort-2-insta-clone-post",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    img_url: file.url,
    user: decoded.id,
  });

  res.status(201).json({
    message: "Post created sucessfully",
    post,
  });
};

const getPostController = async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      message: "Unauthorized access",
    });
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      message: "Token invalid",
    });
  }

  const userId = decoded.id;
  const posts = await postModel.find({
    user: userId,
  });
  res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
};

const getPostDeatailsController = async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      message: "Unauthorized access",
    });

    let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      message: "Token invalid",
    });
  }
  const userId = decoded.id;
  const postId = req.params.postId
  const post = await postModel.findById(postId)

  if(!post) return res.status(404).json({
    message: "Post not found."
  })

  const isValidUser = post.user.toString() === userId;
  if(!isValidUser) return res.status(403).json({
    message: "Forbidden content."
  })

  res.status(200).json({
    message: "Posts fetched successfully",
    post,
  });
};

module.exports = { createPostController, getPostController, getPostDeatailsController };

const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const client = new ImageKit({
  privateKey: process.env["IMAGEKIT_PRIVATE_KEY"],
});

const createPostController = async (req, res) => {
  

  const file = await client.files.upload({
    file: await toFile(Buffer.from("my bytes"), "file"),
    fileName: "fileName",
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
    user: userId
  })

  res.status(200).json({
    message: "Post fetched sucessfully."
  })

};

const getPostDeatailsController = async (req,res) =>{

  const userId = req.user.id;
  const postId = req.params.id;
  const post = await postModel.findById(postId)

  if(!post) return res.status(404).json({
    message: "Post not found."
  })

  const isValidUser = post.user.toString() === userId
  if(!isValidUser) return res.status(403).json({
    message: "Forbidden content."
  })
 res.status(200).json({
    message: "Posts fetched successfully",
    post,
  }); 
}

module.exports = {createPostController, getPostController, getPostDeatailsController};

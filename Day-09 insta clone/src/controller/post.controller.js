const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const postModel = require("../model/post.model");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

const createPostController = async (req, res) => {
  console.log(req.body, req.file);

  const file = await imageKit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), 'file'),
    fileName: "Test"
  })
  res.send(file)
};

module.exports = {
  createPostController,
};

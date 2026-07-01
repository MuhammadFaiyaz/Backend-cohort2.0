const userModel = require("../models/auth.model");
const followModel = require("../models/follow.model");

const followUserController = async (req, res) => {
  const follower = req.user.username;
  const followee = req.params.username;


  if (follower === followee)
    return res.status(400).json({
      message: "You cannot follow yourself",
    });

  const isfolloweeExist = await userModel.findOne({ username: followee });
  if (!isfolloweeExist)
    return res.status(404).json({
      message: "User not found",
    });

  const isAlreadyFollowing = await followModel.findOne({
    follower,
    followee,
  });
  if (isAlreadyFollowing)
    return res.status(400).json({
      message: "You are already following this user",
    });

  const newFollow = await followModel.create({
    follower,
    followee,
  });

  res.status(201).json({
    message: "You are now following this user",
    data: newFollow,
  });
};
const unfollowUserController = async (req, res) => {
  const follower = req.user.username;
  const followee = req.params.username;


  const follow = await followModel.findOne({
    follower,
    followee,
  });

  if (!follow)
    return res.status(400).json({
      message: "You are already not following this user",
    });

  await followModel.findByIdAndDelete(follow._id);
  res.status(200).json({
    message: "User unfollowed successfully",
    data: follow,
  });
};

module.exports = { followUserController, unfollowUserController };

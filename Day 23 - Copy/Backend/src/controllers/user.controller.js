const userModel = require("../models/auth.model");
const followModel = require("../models/follow.model");

const followUserController = async (req, res) => {
  const follower = req.user.username;
  const followee = req.params.username;

  if (follower === followee)
    return res.status(400).json({
      success: false,
      message: "You can't follow yourself",
    });

  const existingFollow = await followModel.findOne({
    follower,
    followee,
  });

  if (existingFollow)
    return res.status(400).json({
      success: false,
      message: "You are already following this user",
    });

    const isFolloweeExist = await userModel.findOne({ username: followee });
  if (!isFolloweeExist)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

  const follow = await followModel.create({
    follower,
    followee,
  });

  if (!follow)
    return res.status(500).json({
      message: "Something went wrong while following the user",
    });

  return res.status(200).json({
    message: "You have started to follow this user",
  });
};

const unfollowUserController = async (req,res)=> {
 const follower = req.user.username;
  const followee = req.params.username;
const existingFollow = await followModel.findOne({
    follower,
    followee,
  });

  if(!existingFollow) return res.status(400).json({
    success: false,
    message: "You are not following this user",
  });

  await followModel.deleteOne({
    follower,
    followee,
  });

  return res.status(200).json({
    message: "You have unfollowed this user",
  });

}

module.exports = { followUserController, unfollowUserController };

const userModel = require("../models/auth.model");
const followModel = require("../models/follow.model");

const followUserController = async (req, res) => {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  if (followerUsername === followeeUsername)
    return res.status(400).json({
      success: false,
      message: "You cannot follow yourself.",
    });

  const alreadyFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (alreadyFollowing)
    return res.status(400).json({
      success: false,
      message: "You are already following this user.",
    });
  const isFolloweeExist = await userModel.findOne({
    username: followeeUsername,
  });

  if (!isFolloweeExist)
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });

  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });

  res.status(201).json({
    message: `You're now following ${followeeUsername}`,
    follow: followRecord,
  });
};

const unfollowUserController = async (req, res) => {
  const { username: follower } = req.user;
  const { username: followee } = req.params;

  const follow = await followModel.findOne({
    follower,
    followee,
  });

  if (!follow)
    return res.status(400).json({
      message: "You are not folllowing this user.",
    });

  await followModel.findByIdAndDelete(follow._id);
  res.status(200).json({
    message: "User undollowed successfully.",
  });
};

module.exports = {followUserController, unfollowUserController};

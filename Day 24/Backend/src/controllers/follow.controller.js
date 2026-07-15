const userModel = require("../models/auth.model");
const followModel = require("../models/follow.model");

const getFollowersController = async (req, res) => {
  try {
    const currentUsername = req.user.username;
    const followRecords = await followModel
      .find({ followee: currentUsername })
      .lean();

    const followers = await Promise.all(
      followRecords.map(async (record) => {
        const user = await userModel
          .findOne({ username: record.follower })
          .select("username profileImage bio")
          .lean();

        return user ? { ...user, followedAt: record.createdAt } : null;
      }),
    );

    return res.status(200).json({
      success: true,
      followers: followers.filter(Boolean),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch followers",
      error: error.message,
    });
  }
};

const getFollowingsController = async (req, res) => {
  try {
    const currentUsername = req.user.username;
    const followRecords = await followModel
      .find({ follower: currentUsername })
      .lean();

    const followings = await Promise.all(
      followRecords.map(async (record) => {
        const user = await userModel
          .findOne({ username: record.followee })
          .select("username profileImage bio")
          .lean();

        return user ? { ...user, followedAt: record.createdAt } : null;
      }),
    );

    return res.status(200).json({
      success: true,
      followings: followings.filter(Boolean),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch followings",
      error: error.message,
    });
  }
};

const getSuggestedUsersController = async (req, res) => {
  try {
    const currentUsername = req.user.username;
    const followRecords = await followModel
      .find({ follower: currentUsername })
      .lean();

    const excludedUsernames = new Set([
      currentUsername,
      ...followRecords.map((record) => record.followee),
    ]);

    const suggestedUsers = await userModel
      .find({ username: { $nin: Array.from(excludedUsernames) } })
      .select("username profileImage bio")
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      suggestedUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch suggested users",
      error: error.message,
    });
  }
};

module.exports = {
  getFollowersController,
  getFollowingsController,
  getSuggestedUsersController,
};

const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  follower: {
    ref: "users",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "follower is required"],
  },
  followee: {
    ref: "users",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "followee is required"],
  },
}, {timestamps: true});

const followModel = mongoose.model("Follow", followSchema);
module.exports = followModel;
const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  follower: {
    type: String,
    required: [true, "follower is required"],
  },
  followee: {
    type: String,
    required: [true, "followee is required"],
  },
}, {timestamps: true});

const followModel = mongoose.model("Follow", followSchema);
module.exports = followModel;
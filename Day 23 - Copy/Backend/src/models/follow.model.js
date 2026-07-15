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
  status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
}, {timestamps: true});

const followModel = mongoose.model("follow", followSchema);
module.exports = followModel;
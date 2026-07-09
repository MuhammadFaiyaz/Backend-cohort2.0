const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.index({ user: 1, post: 1 }, { unique: true });
const likeModel = mongoose.model("Like", likeSchema)
module.exports = likeModel;
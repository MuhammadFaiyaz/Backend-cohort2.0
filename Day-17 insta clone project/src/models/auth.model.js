const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username is already exists"],
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    unique: [true, "email is already exists"],
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  bio: String,
  profileImage: {
    type: String,
    default:
      "https://ik.imagekit.io/muhammadfaiyaz/download.png?updatedAt=1782100859135",
  },
  followers: {
    ref: "users",
    type: mongoose.Schema.Types.ObjectId,
  },
  followings: {
    ref: "users",
    type: mongoose.Schema.Types.ObjectId,
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;

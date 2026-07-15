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
    select: false
  },
  bio: String,
  profileImage: {
    type: String,
    default:
      "https://ik.imagekit.io/muhammadfaiyaz/profile.webp?updatedAt=1783571915971",
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

const userModel = require("../model/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  const { username, email, password, bio, profileImage } = req.body;

  const isUserAlreadyExisted = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (isUserAlreadyExisted)
    return res.status(409).json({
      message:
        "User is already exist with this email or username" +
        (isUserAlreadyExisted.email === email ? "email" : "username"),
    });
  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const user = await userModel.create({
    username,
    email,
    password: hash,
    bio,
    profileImage,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
};

const loginController = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user)
    return res.status(401).json({
      message: "Inavlid user!",
    });

  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const isPasswordValid = user.password === hash;
  if (!isPasswordValid)
    return res.status(401).json({
      message: "Inavlid user!",
    });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token);
  res.status(201).json({
    message: "User logged in successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
};

module.exports = {
  registerController,
  loginController,
};

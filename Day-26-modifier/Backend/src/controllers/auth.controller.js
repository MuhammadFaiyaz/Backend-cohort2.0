const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

async function registerController(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyUserExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isAlreadyUserExists)
    return res.status(409).json({
      message: "User is alrady exists.",
    });

  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);
  return res.status(201).json({
    message: "User registered successfully.",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function loginController(req, res) {
  const { email, password, username } = req.body;
  const user = await userModel
    .findOne({
      $or: [{ email }, { username }],
    })
    .select("+password");
  if (!user)
    return res.status(401).json({
      message: "Invalid credentials.",
    });
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched)
    return res.status(401).json({
      message: "Invalid credentials.",
    });

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);
  return res.status(200).json({
    message: "Login successful.",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);
  return res.status(200).json({ message: "User fetced successfully.", user });
}

async function logoutController(req, res) {
  const token = req.cookies.token;
  res.clearCookie("token");

  await blacklistModel.create({ token });
  res.status(200).json({ message: "Logout successfully." });
}
module.exports = {
  registerController,
  loginController,
  getMeController,
  logoutController,
};

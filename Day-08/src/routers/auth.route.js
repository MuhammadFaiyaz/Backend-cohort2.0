const express = require("express");
const authRouter = express.Router();
const userModel = require("../model/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex");
  const user = await userModel.create({ name, email, password: hash });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "1h",
  });
  res.cookie("token", token);
  res.status(201).json({ message: "User registered successfully", token });
});

authRouter.get("/get-me", async (req, res) => {
  const token = req.cookies.token;
  console.log(req.cookies);
  console.log(req.cookies.token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
  const user = await userModel.findById(decoded.id);

  res.json({
    name: user.name,
    email: user.email,
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });
  const hash = crypto.createHash("md5").update(password).digest("hex");

  if (hash !== user.password)
    return res.status(400).json({ message: "Invalid email or password" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "1h",
  });
  res.cookie("token", token);
  res.status(200).json({ message: "Login successful", token });
});

module.exports = authRouter;

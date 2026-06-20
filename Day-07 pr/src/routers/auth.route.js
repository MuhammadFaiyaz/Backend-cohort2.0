const express = require("express");
const authRouter = express.Router();
const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


authRouter.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser)
    return res.status(400).json({
      message: "This email address is already in use.",
    });

    const hash = crypto.createHash("md5").update(password).digest("hex")
  const user = await userModel.create({
    name,
    email,
    password: hash,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  res.cookie("jwt_token", token);
  res.status(201).json({
    message: "User registered successfully",
    user,
    token,
  });
});

authRouter.post("/protected", async (req, res) => {
  const token = req.cookies;
  console.log(token);
  res.status(200).json({ message: "This is a protected route", token });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user)
    return res.status(404).json({
      message: "This email is not exist.",
    });

  const isPasswordMatched = user.password === crypto.createHash("md5").update(password).digest("hex");
  if (!isPasswordMatched)
    return res.status(401).json({ message: "invalid password" });

  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY);
  res.cookie("jwt_token", token)
  res.status(200).json({
    messsage:"User logged in successfully",
    user
  })
});
module.exports = authRouter;

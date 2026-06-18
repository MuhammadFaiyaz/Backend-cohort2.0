const express = require("express");
const authRouter = express.Router();
const userModel = require("../model/user.model");
const jwt = require('jsonwebtoken')
const cookiePaser = require('cookie-parser')

authRouter.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  const user = await userModel.create({
    name,
    email,
    password,
  });

  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY)

  res.cookie("jwt_token", token)
  res.status(201).json({
    message: "User registered successfully",
    user,
    token
  });
});

module.exports = authRouter;

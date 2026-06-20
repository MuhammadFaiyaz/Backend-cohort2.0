const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUserExisted = await userModel.findOne({ email });
  if (isUserExisted)
    return res
      .status(409)
      .json({ message: "User already exist with this email address" });

    const hashedPassword = crypto.createHash("md5").update(password).digest("hex")

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_KEY,
  );

  res.cookie("jwt_token", token).status(201).json({
    message: "User registered sucessfully.",
    user,
    token,
  });
});

authRouter.post("/protected", async (req, res) => {
  console.log(req.cookies);

  res.status(200).json({
    message: "This is a protected route.",
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  user = await userModel.findOne({ email });

  if (!user)
    return res.status(401).json({
      message: "Invalid email or password",
    });

    const isPasswordMatched = user.password === crypto.createHash("md5").update(password).digest("hex")
    if(!isPasswordMatched) return res.status(401).json({
      message: "Invalid email or password",
    });

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY)
    res.cookie("jwt_token", token);
    res.status(200).json({
        message: "User logged in successfully"
    })
});
module.exports = authRouter;

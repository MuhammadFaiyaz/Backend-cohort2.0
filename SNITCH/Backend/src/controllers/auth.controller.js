import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const sendTokenResponse = async (user, res, message) => {
  const token = jwt.sign({
    id: user._id,
  }, config.JWT_SECRET, {
    expiresIn: '7d'
  })

  res.cookie('token', token)

  res.status(200).json({
    message,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      contactNumber: user.contactNumber,
      role: user.role
    }
  })
}

export const register = async (req, res) => {
  const { email, password, contactNumber, fullName } = req.body;
  try {
    const existingUser = await userModel.findOne(
      { $or: [{ email }, { contactNumber }] }
    );


    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new userModel.create({
      email,
      password,
      contactNumber,
      fullName,
    });

   await sendTokenResponse(user, res, "User registered successfully");

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
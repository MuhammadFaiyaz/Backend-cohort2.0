import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const sendTokenResponse = (req, res) => {
  const token = jwt.sign({
    id: req.user._id,
  }, config.JWT_SECRET)
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



  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
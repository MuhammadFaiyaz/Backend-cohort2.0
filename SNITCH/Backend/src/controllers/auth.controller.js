import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const sendTokenResponse = async (user, res, message) => {
  const token = jwt.sign({
    id: user._id,
    role: user.role
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
      role: user.role,
    }
  })
}

export const register = async (req, res) => {
  const { email, password, contactNumber, fullName, isSeller } = req.body;
  try {
    const existingUser = await userModel.findOne(
      { $or: [{ email }, { contactNumber }] }
    );


    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await userModel.create({
      email,
      password,
      contactNumber,
      fullName,
      role: isSeller ? "seller" : "buyer"
    });

    await sendTokenResponse(user, res, "User registered successfully");

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) return res.status(400).json({ message: "Incorrect email or password" });

    const isMatchedPassword = await user.comparePassword(password);

    if (!isMatchedPassword) return res.status(400).json({ message: "Incorrect email or password" });

    await sendTokenResponse(user, res, "User logged in successfully");
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const googleAuthCallback = async (req, res) => {
  try {
    const {id, displayName, emails, photos} = req.user;
    const email = emails[0].value;
    const porfilePic = photos[0].value;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        fullName: displayName,
        email,
        googleId: id,
        role: 'buyer' 
      })
    }

    const token = jwt.sign({
      id: user._id,
    }, config.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('token', token);

    res.redirect('http://localhost:5173/'); // Redirect to the home page or any other page after successful authentication
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
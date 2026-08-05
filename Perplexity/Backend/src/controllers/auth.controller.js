import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function registerController(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) return res.status(409).json({success: false, err: "User already exists", message: "User is already registered." });

    const user = await userModel.create({ username, email, password });

    await sendEmail({
      to: email,
      subject: "Welcome to Our App!",
      html: `<p>Hello ${username},</p><p>Thank you for registering with our app! We're excited to have you on board.</p><p>Best regards,<br>The Team</p>`,
    });
    
    return res.status(201).json({ message: "User registered successfully.", success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error during registration.", success: false });
  }
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token, user: user.toJSON() });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login." });
  }
}

export async function logoutController(req, res) {
  return res.json({ message: "Successfully logged out." });
}
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js"

export async function registerController(req, res) {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ $or: [{ username }, { email }] });
    if (isUserAlreadyExists) return res.status(400).json({ message: "User already exists", success: false, });

    const user = await userModel.create({ username, email, password });
    const emailVerificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        text: `Hi ${username}, thank you for registering at Perplexity. Verify your email: http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}`,
        html: `
    <p>Hi ${username},</p>
    <p>Thank you for registering at <strong>Perplexity</strong>...</p>
    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
  `
    });

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

export async function verifyEmail(req, res) {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token is required", success: false, err: "Token missing" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });
        if (!user) return res.status(400).json({ message: "User not found", success: false, err: "User not found" });

        user.verified = true;
        await user.save();

        const html = `
            <p>Hi ${user.username},</p>
            <p>Your email has been successfully verified. You can now log in to your account.</p>
            <p>Go to <a href="http://localhost:3000/api/auth/login">Login</a></p>
        `;
        return res.status(200).send(html);

    } catch (err) {
        return res.status(400).json({ message: "Invalid token", success: false, err: "Token invalid" });
    }
}


export async function loginController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) return res.status(400).json({ message: "User not found", success: false, err: "User not found" });

    if (!user.verified) return res.status(400).json({ message: "Email not verified", success: false, err: "Email not verified" });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid password", success: false, err: "Invalid password" });

    const token = jwt.sign({ id: user._id, username: user.username, }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token);
    res.status(200).json({ message: "Login successful", success: true, user: {
            id: user._id,
            username: user.username,
            email: user.email
        } });
}

export async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found", success: false, err: "User not found" });
    res.status(200).json({ message: "User fetched successfully", success: true, user });
}
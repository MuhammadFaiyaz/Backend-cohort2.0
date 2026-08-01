const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");

async function registerController(req, res) {
    try {
        const { username, email, password } = req.body;

        const isUserAlreadyExisted = await userModel.findOne({
            $or: [{ email }, { username }]
        })

        if (isUserAlreadyExisted)
            return res.status(409).json({
                success: false,
                message: "User already exists.",
            });

        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({ username, email, password: hash });
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })

        res.cookie("token", token);
        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function loginController(req, res) {
    try {
        const { username, email, password } = req.body;
        const user = await userModel.findOne({
            $or: [{ email }, { username }]
        }).select("+password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })

        res.cookie("token", token);
        return res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);
    return res.status(200).json({ message: "User fetced successfully.", user });
}

async function logoutController(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "User is not logged in.",
        });
    }

    res.clearCookie("token");
    await redis.set(token, Date.now().toString(), "Ex", 60 * 60 * 24);

    return res.status(200).json({
        success: true,
        message: "User logged out successfully.",
    }); 
}

module.exports = {
    registerController, loginController, getMeController, logoutController
}
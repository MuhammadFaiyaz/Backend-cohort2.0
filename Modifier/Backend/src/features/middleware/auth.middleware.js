const redis = require("../config/cache");
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token)
            return res.status(401).json({
                success: false,
                message: "Token not provided. Please log in.",
            });

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (jwtError) {
            // Handle specific JWT errors
            if (jwtError.name === "TokenExpiredError") return res.status(401).json({
                success: false,
                message: "Token has expired. Please log in again.",
            });

            if (jwtError.name === "JsonWebTokenError") return res.status(401).json({
                success: false,
                message: "Invalid token. Please log in again.",
            });

            throw jwtError;
        }

        const isBlackListedToken = await redis.get(token);
        if (isBlackListedToken) return res.status(401).json({
            success: false,
            message: "Token has been revoked.",
        });

        if (!decoded.id) return res.status(401).json({
                success: false,
                message: "Invalid token payload.",
            });


            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token.",
            });
        }
    }


module.exports = authUser;
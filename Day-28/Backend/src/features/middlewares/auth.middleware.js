const jwt = require("jsonwebtoken");
const redis = require("../config/cache");


const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(401).json({
        success: false,
        message: "Token not provided.",
      });

    const isTokenBlacklisted = await redis.get(token);
    if (isTokenBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token has been revoked.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = authUser;

const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
  try {
    const token = req.user.token;

    if (!token)
      return res.status(401).json({
        success: false,
        message: "Token not provided.",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authUser;

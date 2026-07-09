const jwt = require("jsonwebtoken");

const identifyUser = async (req, res, next) => {
  const token = req.cookies.token;

  console.log("Token:", token);
  console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

  if (!token)
    return res.status(401).json({
      message: "Token not provided, Unauthorized access",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    console.log("Decoded:", decoded);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "unauthorized user",
    });
  }
};

module.exports = identifyUser;

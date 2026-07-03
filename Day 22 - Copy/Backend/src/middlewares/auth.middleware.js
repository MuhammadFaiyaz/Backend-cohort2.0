const jwt = require("jsonwebtoken");
const identifyUser = async(req, res, next)=>{
    const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      message: "Token not provided, Unauthorized access",
    });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      message: "unauthorized user",
    });
  }

  req.user = decoded;

  next()
}

module.exports = identifyUser;

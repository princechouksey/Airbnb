const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const CustomError = require("../utils/customError.js");
const cacheClient = require("../services/cache.services.js");

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("token--->", token);
  if (!token) {
    return next(new CustomError("Please login to access this resource", 401));
  }
  try {
    if (!token) return next(new CustomError("Unauthorized User", 401));
    const blackListToken = await cacheClient.get(token);
    if (blackListToken)
      return res.status(401).json({ message: "token blacklisted" });
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return next(new CustomError("Unauthorized User", 401));
    const user = await User.findById(decoded.id);

    if (!user) return next(new CustomError("User Not Found ", 401));
    req.user = user;
    next();
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};
module.exports = authMiddleware;

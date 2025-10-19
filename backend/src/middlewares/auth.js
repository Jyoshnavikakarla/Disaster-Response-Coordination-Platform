const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Authority = require("../models/Authority");

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "authority") {
      req.user = await Authority.findById(decoded.id).select("-password");
    } else {
      req.user = await User.findById(decoded.id).select("-password");
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};

module.exports = { protect, authorize };

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey"; // you can store it in .env

// Generate a token for a user
function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "2h" });
}

// Verify a token from frontend
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { generateToken, verifyToken };

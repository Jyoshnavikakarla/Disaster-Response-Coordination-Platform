const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Authority = require("../models/Authority");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, check if the user exists in Authorities
    let user = await Authority.findOne({ email });
    let role = "authority";

    // If not found, check in Users
    if (!user) {
      user = await User.findOne({ email });
      role = "user";
    }

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role }, 
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role } 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

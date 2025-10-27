const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { protect } = require("../middlewares/auth");
const User = require("../models/User");
const Authority = require("../models/Authority");

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser =
      (await User.findOne({ email })) || (await Authority.findOne({ email }));
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === "authority") {
      newUser = new Authority({ name, email, password: hashedPassword });
    } else {
      newUser = new User({ name, email, password: hashedPassword });
    }

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: { id: newUser._id, name, email, role: role || "user" },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Authority.findOne({ email });
    let role = "authority";

    if (!user) {
      user = await User.findOne({ email });
      role = "user";
    }

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- GET /api/auth/me ----------------
router.get("/me", protect, async (req, res) => {
  try {
    if (!req.user)
      return res.status(404).json({ message: "User not found" });
    res.json({ user: req.user });
  } catch (err) {
    console.error("Error in /me route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
// src/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

// ------------------- REGISTER -------------------
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: "Invalid input" });

    try {
      const { name, email, phone, password, role } = req.body;

      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ message: "User already exists" });

      const hashed = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, phone, password: hashed, role });

      const token = jwt.sign({ id: newUser._id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({ token, user: newUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ------------------- LOGIN -------------------
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: "Invalid input" });

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Incorrect password" });

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ token, user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

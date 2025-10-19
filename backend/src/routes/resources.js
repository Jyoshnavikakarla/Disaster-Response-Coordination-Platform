// src/routes/resources.js
import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";

const router = express.Router();

// ------------------- RATE LIMITER (DDoS mitigation) -------------------
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // max 10 requests per IP per minute
  message: "Too many requests from this IP, please try again later",
});

// ------------------- AUTH MIDDLEWARE -------------------
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ------------------- POST /api/resources -------------------
// Submit a help request
router.post(
  "/",
  auth,
  limiter,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("contact")
      .notEmpty()
      .withMessage("Contact is required")
      .isMobilePhone()
      .withMessage("Valid contact number required"),
    body("details").notEmpty().withMessage("Details are required"),
  ],
  async (req, res) => {
    // ------------------- Input Validation -------------------
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });
    }

    try {
      const { name, location, lat, lng, contact, details } = req.body;

      const newRequest = {
        name,
        location,
        lat,
        lng,
        contact,
        details,
        userId: req.user.id, // link request to logged-in user
        role: req.user.role,
        status: "Pending",
        createdAt: new Date(),
      };

      // ------------------- Save to DB -------------------
      // Example MongoDB:
      // await RequestModel.create(newRequest);

      // Temporary mock for testing:
      res.status(201).json({ _id: Date.now(), ...newRequest });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;

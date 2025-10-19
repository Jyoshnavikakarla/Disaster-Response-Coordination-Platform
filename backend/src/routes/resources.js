import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import ResourceRequest from "../models/ResourceRequest.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, try again later",
});

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

router.post(
  "/",
  auth,
  limiter,
  [
    body("name").notEmpty().withMessage("Name required"),
    body("location").notEmpty().withMessage("Location required"),
    body("contact").notEmpty().isMobilePhone().withMessage("Valid contact required"),
    body("details").notEmpty().withMessage("Details required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid input", errors: errors.array() });

    try {
      const { name, location, lat, lng, contact, details } = req.body;
      const newRequest = await ResourceRequest.create({
        name, location, lat, lng, contact, details, role: req.user.role, userId: req.user.id
      });
      res.status(201).json(newRequest);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;

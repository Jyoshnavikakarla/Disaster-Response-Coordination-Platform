// src/routes/alerts.js
import express from "express";
import Alert from "../models/Alert.js";

const router = express.Router();

// GET all alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new alert
router.post("/", async (req, res) => {
  try {
    const { type, message, createdBy } = req.body;
    const newAlert = new Alert({ type, message, createdBy });
    const savedAlert = await newAlert.save();
    res.status(201).json(savedAlert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

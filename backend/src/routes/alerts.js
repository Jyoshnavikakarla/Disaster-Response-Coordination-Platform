const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const { protect } = require("../middlewares/auth");

// Create alert
router.post("/", protect, async (req, res) => {
  try {
    const { type, message } = req.body; // match frontend
    const alert = new Alert({ type, message, userId: req.user.id });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all alerts
router.get("/", protect, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 

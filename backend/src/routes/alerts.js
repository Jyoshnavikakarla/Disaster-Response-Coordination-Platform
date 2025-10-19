const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const { protect } = require("../middlewares/auth");

// Create alert
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const alert = new Alert({ title, description, location, userId: req.user.id });
    await alert.save();
    res.status(201).json({ message: "Alert created", alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all alerts
router.get("/", protect, async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// src/routes/user.js
import express from "express";
import Request from "../models/Request.js";
import VolunteerActivity from "../models/VolunteerActivity.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Victim requests
router.get("/:userId/requests", protect, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.params.userId });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Volunteer activities
router.get("/:userId/activities", protect, async (req, res) => {
  try {
    const activities = await VolunteerActivity.find({ volunteerId: req.params.userId });
    res.json({ activities });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

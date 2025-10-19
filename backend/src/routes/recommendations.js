// src/routes/recommendations.js
import express from "express";
import User from "../models/User.js";
import Request from "../models/Request.js";
import Activity from "../models/VolunteerActivity.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// GET recommendations for a user
router.get("/:userId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let recommendations = [];

    if (user.role === "victim") {
      // Example: suggest volunteers for the same location
      const requests = await Request.find({ userId: user._id });
      const locations = requests.map(r => r.location);
      recommendations = ["volunteer", ...locations];  // Add role + personalized
    } else if (user.role === "volunteer") {
      // Suggest tasks similar to completed ones
      const activities = await Activity.find({ volunteerId: user._id, status: "completed" });
      const taskTypes = activities.map(a => a.taskType);
      recommendations = ["request", ...taskTypes];
    } else if (user.role === "authority") {
      recommendations = ["map", "alerts", "volunteer"];
    }

    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

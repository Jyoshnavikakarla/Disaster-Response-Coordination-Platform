// src/routes/user.js
import express from "express";
import User from "../models/User.js";
import Request from "../models/Request.js"; // Victim requests
import Activity from "../models/Volunteer.js"; // Volunteer activities
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ----------------- User History -----------------
router.post("/history", authenticateToken, async (req, res) => {
  const { page } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.history.includes(page)) {
      user.history.push(page);
      await user.save();
    }

    res.json({ message: "History updated", history: user.history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Victim Requests -----------------
router.get("/:id/requests", authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (id !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  try {
    const requests = await Request.find({ userId: id });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Volunteer Activities -----------------
router.get("/:id/activities", authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (id !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  try {
    const activities = await Activity.find({ volunteerId: id });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id/recommendations", authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (id !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Example recommendation logic
    let recommendations = [];
    if (user.role === "victim") {
      recommendations = ["Nearby shelters", "Food donation spots", "Emergency contacts"];
    } else if (user.role === "volunteer") {
      recommendations = ["Nearby requests", "Volunteer events", "Training programs"];
    }

    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;

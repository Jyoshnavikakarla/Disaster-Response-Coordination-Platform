const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth"); // your auth middleware
const Request = require("../models/Request");
const User = require("../models/User"); // import User model

// ------------------- Existing route: GET /api/dashboard/user -------------------
router.get("/user", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const allRequests = await Request.find({ userId });

    const resolved = allRequests.filter(r => r.status === "Resolved").length;
    const pending = allRequests.filter(r => r.status === "Pending").length;
    const ongoing = allRequests.filter(r => r.status === "Ongoing").length;

    const grouped = {};
    allRequests.forEach(r => {
      const day = new Date(r.createdAt).toLocaleDateString("en-US", { weekday: "short" });
      grouped[day] = (grouped[day] || 0) + 1;
    });
    const barData = Object.entries(grouped).map(([name, requests]) => ({ name, requests }));

    const recentRequests = allRequests
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(r => ({
        type: r.type,
        date: r.createdAt,
        status: r.status,
        location: r.location || "N/A",
      }));

    res.json({ resolved, pending, ongoing, barData, recentRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

// ------------------- NEW route: GET /api/dashboard/stats -------------------
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const stats = {
      totalActions: user.history.length, // example: number of actions
      location: user.location,
      name: user.name,
    };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth"); // your auth middleware
const Resource = require("../models/Resource");
const User = require("../models/User"); // import User model

// ------------------- Existing route: GET /api/dashboard/user -------------------
router.get("/user", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all requests for this user from Resource collection
    const allRequests = await Resource.find({ userId }).sort({ createdAt: -1 });

    // Calculate stats
    const resolved = allRequests.filter(r => r.status.toLowerCase() === "completed").length;
    const pending = allRequests.filter(r => r.status.toLowerCase() === "pending").length;
    const ongoing = allRequests.filter(r => r.status.toLowerCase() === "ongoing").length;

    // Group by day (for charts)
    const grouped = {};
    allRequests.forEach(r => {
      const day = new Date(r.createdAt).toLocaleDateString("en-US", { weekday: "short" });
      grouped[day] = (grouped[day] || 0) + 1;
    });
    const barData = Object.entries(grouped).map(([name, requests]) => ({ name, requests }));

    // Prepare recent requests list
// Assuming you get allRequests from backend
console.log("All requests from backend:", allRequests);

const recentRequests = allRequests.slice(0, 5).map(r => ({
  _id: r._id,          // request id
  type: r.details || "General",
  date: r.createdAt,
  status: r.status,
  location: r.location || "N/A",
  reportId: r.reportId, 
}));

console.log("Mapped recentRequests:", recentRequests);




    // Send data to frontend
    res.json({ resolved, pending, ongoing, barData, recentRequests });
  } catch (err) {
    console.error("Error fetching user dashboard:", err);
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

// backend/src/routes/authority.js
const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const VolunteerActivity = require("../models/VolunteerActivity");
const { protect } = require("../middlewares/auth"); // ✅ use protect, not authMiddleware

// Authority dashboard stats
router.get("/dashboard", protect, async (req, res) => {
  try {
    // Count requests
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: "pending" });
    const resolvedRequests = await Request.countDocuments({ status: "resolved" });

    // Count volunteers
    const totalVolunteers = await VolunteerActivity.countDocuments();

    // Resource summary for pie chart
    const resourceCounts = await Request.aggregate([
      { $group: { _id: "$resourceType", count: { $sum: 1 } } },
    ]);

    const resources = { food: 0, medicine: 0, water: 0, shelter: 0, clothes: 0 };
    resourceCounts.forEach(r => {
      if (resources[r._id] !== undefined) resources[r._id] = r.count;
    });

    // Latest requests (live feed)
    const latestRequests = await Request.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      stats: { totalRequests, pendingRequests, resolvedRequests, totalVolunteers },
      resources,
      latestRequests
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

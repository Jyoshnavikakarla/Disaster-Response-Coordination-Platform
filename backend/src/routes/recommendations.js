const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middlewares/auth");

// Get recommendations for user
router.get("/:id", protect, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Example rule-based recommendations
    const rules = {
      volunteer: ["request", "map"],
      request: ["map", "volunteer"],
      map: ["alerts", "request"],
      alerts: ["map", "volunteer"],
      selection: ["map", "volunteer"],
      about: ["map", "volunteer"],
    };

    const recs = new Set();
    user.history.forEach((page) => {
      if (rules[page]) rules[page].forEach((r) => recs.add(r));
    });

    res.json({ recommendations: Array.from(recs) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

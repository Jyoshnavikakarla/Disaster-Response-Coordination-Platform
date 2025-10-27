const express = require('express');
const router = express.Router();

// GET /api/insights/smart
router.get('/smart', async (req, res) => {
  try {
    // Example logic: pick suggestion dynamically (can replace with DB/AI later)
    const suggestions = [
      "Heavy rainfall in your area — stay cautious.",
      "High number of flood requests reported today.",
      "Volunteer activity is low — consider increasing notifications.",
      "Fire hazards reported nearby — stay alert.",
      "Cyclone alert: check emergency protocols."
    ];

    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

    res.json({ suggestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ suggestion: "Unable to fetch insights at the moment." });
  }
});

module.exports = router;

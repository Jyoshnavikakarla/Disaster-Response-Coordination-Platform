const express = require("express");
const router = express.Router();

router.get("/:location", async (req, res) => {
  const location = req.params.location.toLowerCase();
  let suggestion = "No current alerts in your area.";
  
  // Mock simple logic
  if(location === "mumbai") {
    suggestion = "Heavy rainfall in your area — stay cautious.";
  }

  res.json({ suggestion });
});

module.exports = router;

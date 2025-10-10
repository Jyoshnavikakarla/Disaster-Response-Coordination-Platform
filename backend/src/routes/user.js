// src/routes/user.js
const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const VolunteerActivity = require("../models/VolunteerActivity");
const  authMiddleware  = require("../middlewares/auth");

// Victim requests
router.get("/:userId/requests", authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.params.userId });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Volunteer activities
router.get("/:userId/activities", authMiddleware, async (req, res) => {
  try {
    const activities = await VolunteerActivity.find({ volunteerId: req.params.userId });
    res.json({ activities });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

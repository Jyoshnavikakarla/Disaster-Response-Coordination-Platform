const express = require("express");
const router = express.Router();
const Resource = require("../models/ResourceRequest");
const { protect } = require("../middlewares/auth");

// Create a resource
router.post("/", protect, async (req, res) => {
  try {
    const { name, location, contact, details, role } = req.body;
    const resource = new Resource({
      name,
      location,
      contact,
      details,
      role,
      userId: req.user.id,
    });
    await resource.save();
    res.status(201).json({ message: "Resource created", resource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all resources
router.get("/", protect, async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const auth = require('../middlewares/auth');

// POST /api/resources
router.post('/', auth, async (req, res) => {
  try {
    const { name, location, contact, details, role, userId } = req.body;

    const newResource = new Resource({ name, location, contact, details, role, userId });
    const saved = await newResource.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating resource:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

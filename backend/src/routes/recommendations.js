const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware  = require('../middlewares/auth');

// GET recommendations for a user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let recommendations = [];

    if (user.role === 'user') {
      recommendations = ['volunteer', 'request', 'map'];
    } else if (user.role === 'authority') {
      recommendations = ['map', 'alerts', 'volunteer'];
    }

    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

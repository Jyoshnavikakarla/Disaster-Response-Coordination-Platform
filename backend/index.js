const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// Routes
const authRoutes = require('./src/routes/auth');
const reportRoutes = require('./src/routes/reports');
const resourceRoutes = require('./src/routes/resources');
const alertRoutes = require('./src/routes/alerts');
const recommendationRoutes = require('./src/routes/recommendations');
const userRoutes = require("./src/routes/user");
const { errorHandler } = require('./src/middlewares/error');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use("/api/user", userRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

const User = require('./src/models/User'); // import User model

// ------------------ Record Page Visit ------------------
app.post('/api/user/history', async (req, res) => {
  const { userId, page } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.history.includes(page)) {
      user.history.push(page);
      await user.save();
    }

    res.json({ message: 'History updated', history: user.history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------ Fetch Recommendations ------------------
app.get('/api/user/:id/recommendations', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Simplified rule-based recommendations
    const rules = {
      volunteer: ['request', 'map'],
      request: ['map', 'volunteer'],
      map: ['alerts', 'request'],
      alerts: ['map', 'volunteer'],
      selection: ['map', 'volunteer'],
      about: ['map', 'volunteer']
    };

    const recs = new Set();
    user.history.forEach(page => {
      if (rules[page]) {
        rules[page].forEach(r => recs.add(r));
      }
    });

    res.json({ recommendations: Array.from(recs) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

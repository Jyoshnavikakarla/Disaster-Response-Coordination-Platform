// ------------------ Imports ------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const User = require("./src/models/User");
const ResourceRequest = require("./src/models/ResourceRequest"); // if you use it

// Routes
const authRoutes = require("./src/routes/auth");
const reportRoutes = require("./src/routes/reports");
const resourceRoutes = require("./src/routes/resources");
const alertRoutes = require("./src/routes/alerts");
const recommendationRoutes = require("./src/routes/recommendations");
const userRoutes = require("./src/routes/user");
const authorityRoutes = require("./src/routes/authority");
const suggestionRoutes = require("./src/routes/suggestions");
const dashboardRoutes = require("./src/routes/dashboard");

// Error middleware
const { errorHandler } = require("./src/middlewares/errorHandler");

// ------------------ App Setup ------------------
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🌐 Disaster Response Backend is Running");
});

// ------------------ API Routes ------------------
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/authority", authorityRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/dashboard", dashboardRoutes);


// ------------------ User History & Recommendations -----`-------------
app.post("/api/user/history", async (req, res) => {
  const { userId, page } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.history.includes(page)) {
      user.history.push(page);
      await user.save();
    }

    res.json({ message: "History updated", history: user.history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/user/:id/recommendations", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

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

// ------------------ Catch-all ------------------
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ------------------ Error Handler ------------------
app.use(errorHandler);

// ------------------ MongoDB Connection ------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

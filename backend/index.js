// ------------------ Imports ------------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import volunteerRoutes from "./src/routes/volunteers.js";
import resourceRoutes from "./src/routes/resources.js";
import authRoutes from "./src/routes/auth.js";
import reportRoutes from "./src/routes/reports.js";
import alertRoutes from "./src/routes/alerts.js";
import recommendationsRouter from "./src/routes/recommendations.js";
import userRoutes from "./src/routes/user.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

import User from "./src/models/User.js"; // Import User model

// ------------------ App Setup ------------------
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ------------------ Middleware ------------------
app.use(cors());
app.use(express.json());

// ------------------ Routes ------------------
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/user", userRoutes);
app.use("/api/volunteers", volunteerRoutes);

// ------------------ Error Handler ------------------
app.use(errorHandler);

// ------------------ MongoDB Connection ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ------------------ User History ------------------
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

// ------------------ Recommendations ------------------
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
      if (rules[page]) {
        rules[page].forEach((r) => recs.add(r));
      }
    });

    res.json({ recommendations: Array.from(recs) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

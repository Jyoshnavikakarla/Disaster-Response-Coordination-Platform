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

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

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

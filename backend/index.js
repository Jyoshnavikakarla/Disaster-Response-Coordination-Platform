const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🌐 Disaster Response Backend is Running");
});

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/reports", require("./src/routes/reports"));
app.use("/api/resources", require("./src/routes/resources"));
app.use("/api/alerts", require("./src/routes/alerts"));
app.use("/api/recommendations", require("./src/routes/recommendations"));
app.use("/api/user", require("./src/routes/user"));
app.use("/api/authority", require("./src/routes/authority"));
app.use("/api/suggestions", require("./src/routes/suggestions"));
app.use("/api/dashboard", require("./src/routes/dashboard"));

// Catch-all for unknown routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
const { errorHandler } = require("./src/middlewares/error");
app.use(errorHandler);

// MongoDB connection
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

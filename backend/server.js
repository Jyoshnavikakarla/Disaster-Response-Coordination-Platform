const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Routes
const authRoutes = require("./routes/auth.js");
const resourceRoutes = require("./routes/resources.js");
const volunteerRoutes = require("./routes/volunteers.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Limit each IP: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, try again later",
});
app.use(limiter);

// Optional: Blocklist for suspicious IPs
const blocklist = ["192.168.1.10"];
app.use((req, res, next) => {
  if (blocklist.includes(req.ip)) return res.status(403).send("Forbidden");
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/volunteers", volunteerRoutes);

// Self-signed certificate
const server = https.createServer(
  {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
  },
  app
);

server.listen(5000, () => {
  console.log("✅ HTTPS server running on https://localhost:5000");
});

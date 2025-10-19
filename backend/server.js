import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import resourceRoutes from "./routes/resources.js";
import rateLimit from "express-rate-limit";
const app = express();
app.use(cors());
app.use(express.json());


// Limit each IP: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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
import volunteerRoutes from "./routes/volunteers.js";
app.use("/api/volunteers", volunteerRoutes);
import resourceRoutes from "./routes/resources.js";
app.use("/api/resources", resourceRoutes);


// Self-signed certificate
const server = https.createServer(
  {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
  },
  app
);

server.listen(5000, () =>
  console.log("✅ HTTPS server running on https://localhost:5000")
);

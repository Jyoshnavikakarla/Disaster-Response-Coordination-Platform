// src/routes/reports.js
import express from "express";
import Report from "../models/Report.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  console.log("Received report:", req.body);
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
});

export default router;

const express = require("express");
const Report = require("../models/Report.js");
const Resource = require("../models/ResourceRequest.js");
const { protect } = require("../middlewares/auth.js");
const router = express.Router();
const { getReportById } = require("../reportcontroller.js");

// Get report by ID
router.get("/:id", getReportById);

// ✅ Update report status
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    // Update report
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Also update linked Resource request if exists
    if (report.requestId) {
      await Resource.findByIdAndUpdate(report.requestId, { status });
    }

    res.json(report); // Send updated report back
  } catch (err) {
    console.error("❌ Error updating report status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new report linked to a Resource
router.post("/", protect, async (req, res) => {
  try {
    const { requestId, title, description, location } = req.body;

    if (!requestId) return res.status(400).json({ message: "requestId is required" });

    const request = await Resource.findById(requestId);
    if (!request) return res.status(404).json({ message: "Resource request not found" });

    const report = new Report({
      userId: req.user?._id,
      title,
      description,
      location,
      requestId,
      status: "Pending",
    });
    await report.save();

    request.reportId = report._id;
    await request.save();

    res.status(201).json({ report, request });
  } catch (err) {
    console.error("❌ Error creating report:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
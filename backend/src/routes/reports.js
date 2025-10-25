const express = require("express");
const Report = require("../models/Report.js");
const Resource = require("../models/Resource.js"); // ✅ make sure the name matches your file
const { protect } = require("../middlewares/auth.js");
const router = express.Router();
const { getReportById,updateReportStatus } =require("../reportcontroller.js");
router.get("/:id", getReportById);
// PUT /api/reports/:id/status
router.put("/:id/status", updateReportStatus);

// ✅ Create a new report and link it to a resource request
router.post("/", protect, async (req, res) => {
  try {
    const { requestId, title, description, location } = req.body;

    console.log("📩 Incoming report data:", req.body);

    // 1️⃣ Validate input
    if (!requestId) {
      return res.status(400).json({ message: "requestId is required" });
    }

    // 2️⃣ Check if the resource request exists
    const request = await Resource.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Resource request not found" });
    }

    // 3️⃣ Create the report
    const report = new Report({
      userId: req.user?._id, // if you’re using authentication
      title,
      description,
      location,
      requestId, // ✅ store reference to request
    });

    await report.save();

    // 4️⃣ Link the report to the original resource request
    request.reportId = report._id;
    await request.save();

    console.log("✅ Report created and linked:", { reportId: report._id, requestId });

    // 5️⃣ Send both back
    res.status(201).json({ report, request });
  } catch (err) {
    console.error("❌ Error creating report:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ------------------- Fix missing reports -------------------
router.post("/fix-missing-reports", protect, async (req, res) => {
  try {
    // Find all Resource requests without a reportId
    const requestsWithoutReport = await Resource.find({ reportId: { $exists: false } });
    const fixedReports = [];

    for (const reqItem of requestsWithoutReport) {
      // Create a new Report
      const report = new Report({
        userId: req.user?._id, // if using authentication
        title: "Food & Water Request",
        description: reqItem.details,
        location: reqItem.location,
        requestId: reqItem._id,
        status: "Pending",
      });

      await report.save();

      // Link the report to the Resource request
      reqItem.reportId = report._id;
      await reqItem.save();

      fixedReports.push({ requestId: reqItem._id, reportId: report._id });
    }

    res.json({ message: "Missing reports fixed", fixedReports });
  } catch (err) {
    console.error("❌ Error fixing missing reports:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
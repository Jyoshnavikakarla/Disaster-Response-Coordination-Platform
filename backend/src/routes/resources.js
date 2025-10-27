const express = require("express");
const router = express.Router();
const Resource = require("../models/ResourceRequest");
const { protect } = require("../middlewares/auth");

// Create a resource
router.post("/", protect, async (req, res) => {
  try {
    const { name, location, contact, details, role } = req.body;
    const resource = new Resource({
      name,
      location,
      contact,
      details,
      role,
      userId: req.user.id,
    });
    await resource.save();
    res.status(201).json({ message: "Resource created", resource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all resources
router.get("/", protect, async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Update request status
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    // Only allow specific status values
    const allowedStatuses = ["Pending", "Ongoing", "Completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find and update the resource
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Status updated successfully", resource });
  } catch (err) {
    console.error("Status update failed:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});
router.put("/:id/link-report", protect, async (req, res) => {
  const { id } = req.params;
  const { reportId } = req.body;

  try {
    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ message: "Request not found" });

    resource.reportId = reportId;
    await resource.save();

    res.json(resource);
  } catch (err) {
    
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

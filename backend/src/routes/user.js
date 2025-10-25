const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Request = require("../models/Request");
const VolunteerActivity = require("../models/VolunteerActivity");
const { protect } = require("../middlewares/auth");

// ✅ 1. Get current user profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 2. Update user profile
// ✅ Update user profile (save to MongoDB)
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, location, avatar } = req.body;

    // Update and return latest user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, email, location, avatar } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    // ✅ Return updated user for frontend
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ 3. User stats (based on their own requests)
router.get("/stats", protect, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id });

    const totalRequests = requests.length;
    const pending = requests.filter((r) => r.status === "pending").length;
    const resolved = requests.filter((r) => r.status === "resolved").length;
    const ongoing = requests.filter((r) => r.status === "ongoing").length;

    res.json({
      totalRequests,
      pending,
      resolved,
      ongoing,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 4. Fetch requests created by the logged-in user
router.get("/:userId/requests", protect, async (req, res) => {
  try {
    // Ensure user can only fetch their own requests
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const requests = await Request.find({ userId: req.params.userId });
    res.json({ requests });
  } catch (err) {
    console.error("User requests error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ 5. Volunteer activities (if applicable)
router.get("/:userId/activities", protect, async (req, res) => {
  try {
    const activities = await VolunteerActivity.find({
      volunteerId: req.params.userId,
    });
    res.json({ activities });
  } catch (err) {
    console.error("Volunteer activities error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ 6. Logout user
router.post("/logout", protect, (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});
//✅ Victim requests by userId
router.get("/:userId/requests", protect, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.params.userId });
    res.json({ requests });
  } catch (err) {
    console.error("Error fetching user requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Save user history
router.post("/history", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page } = req.body; // page visited

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.history) user.history = []; // make sure history array exists
    user.history.push({ page, date: new Date() });

    await user.save();
    res.json({ message: "History updated", history: user.history });
  } catch (err) {
    console.error("Error saving history:", err);
    res.status(500).json({ message: "Failed to save history" });
  }
});


module.exports = router;

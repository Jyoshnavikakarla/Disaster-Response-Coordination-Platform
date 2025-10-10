// src/models/VolunteerActivity.js
const mongoose = require("mongoose");

const VolunteerActivitySchema = new mongoose.Schema({
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: String,
  location: String,
  lat: Number,
  lng: Number,
  status: { type: String, default: "completed" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VolunteerActivity", VolunteerActivitySchema);

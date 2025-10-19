// backend/src/models/VolunteerActivity.js
const mongoose = require("mongoose");

const volunteerActivitySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  skills: [String],
  availability: String,
  location: String,
});

module.exports = mongoose.model("VolunteerActivity", volunteerActivitySchema);

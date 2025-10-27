// src/models/Report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Ongoing", "Resolved"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;

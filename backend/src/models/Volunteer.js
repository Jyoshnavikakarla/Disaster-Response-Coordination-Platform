// src/models/Volunteer.js
const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskType: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  resources: { type: String },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
module.exports=  Volunteer;

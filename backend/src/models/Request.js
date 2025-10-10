// src/models/Request.js
const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  location: String,
  lat: Number,       // optional for map display
  lng: Number,
  contact: String,
  details: String,
  status: { type: String, default: "pending" }, // pending, completed, in-progress
  role: String // victim or volunteer
}, { timestamps: true });

module.exports = mongoose.model("Request", RequestSchema);

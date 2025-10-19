// src/models/Request.js
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  request: { type: String, required: true },
  location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const Request = mongoose.model("Request", requestSchema);
export default Request;

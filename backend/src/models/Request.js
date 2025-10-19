// src/models/Request.js
import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    location: String,
    lat: Number,       // optional for map display
    lng: Number,
    contact: String,
    details: String,
    status: { type: String, default: "pending" }, // pending, completed, in-progress
    role: String // victim or volunteer
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", RequestSchema);
export default Request;

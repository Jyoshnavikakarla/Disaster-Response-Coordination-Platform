// src/models/VolunteerActivity.js
import mongoose from "mongoose";

const VolunteerActivitySchema = new mongoose.Schema(
  {
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    task: String,
    location: String,
    lat: Number,
    lng: Number,
    status: { type: String, default: "completed" },
    date: { type: Date, default: Date.now }
  }
);

const VolunteerActivity = mongoose.model("VolunteerActivity", VolunteerActivitySchema);
export default VolunteerActivity;

// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["victim", "volunteer", "authority"], required: true },
  history: { type: [String], default: [] }, // For storing visited pages
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;

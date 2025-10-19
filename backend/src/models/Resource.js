// src/models/Resource.js
import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    details: { type: String, required: true },
    role: { type: String }, // victim or volunteer
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional link
  },
  { timestamps: true }
);

const Resource = mongoose.model('Resource', ResourceSchema);
export default Resource;

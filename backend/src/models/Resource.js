const mongoose = require("mongoose");

const ResourceRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  details: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  role: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports=  mongoose.model("ResourceRequest", ResourceRequestSchema);

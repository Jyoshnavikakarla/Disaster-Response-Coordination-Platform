const mongoose = require("mongoose");

const authoritySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "authority" }
}, { timestamps: true });

module.exports = mongoose.model("Authority", authoritySchema);

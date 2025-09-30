const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  details: { type: String, required: true },
  role: { type: String },       // victim or volunteer
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional if you want link
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);

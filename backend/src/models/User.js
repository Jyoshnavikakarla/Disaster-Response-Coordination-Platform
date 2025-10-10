const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  history: { type: [String], default: [] } // ✅ Track visited pages
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);


// Alert.js
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['INFO', 'ALERT'], required: true },
    message: { type: String, required: true },
    createdBy: { type: String }, // optional: user name or role
  },
  { timestamps: true }
);

const Alert = mongoose.model('Alert', alertSchema);
module.exports=  Alert;

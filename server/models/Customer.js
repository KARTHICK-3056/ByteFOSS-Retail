const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  f: { type: String, required: true }, // First Name
  l: { type: String, required: true }, // Last Name
  e: { type: String, required: true }, // Email
  p: { type: String, required: true }, // Phone
  o: { type: Number, default: 0 },     // Order count
  points: { type: Number, default: 0 },
  date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  time: { type: String },
  productName: { type: String },
  oldStock: { type: Number },
  newStock: { type: Number },
  action: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);

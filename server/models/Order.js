const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  total: { type: Number, required: true },
  items: [{
    id: { type: String }, // Product ID
    name: { type: String },
    qty: { type: Number },
    price: { type: Number },
    tax: { type: Number }
  }],
  date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  barcode: { type: String, required: true, unique: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, required: true },
  category: { type: String, default: 'General' },
  imageUrl: { type: String, default: '' },
  date: { type: String } // Keeping string to match current format, though Date is better
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

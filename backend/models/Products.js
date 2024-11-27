const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  date_added: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

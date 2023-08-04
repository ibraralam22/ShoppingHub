const mongoose = require('mongoose');

const product = new mongoose.Schema({
  product_name: { type: String, required: true },
  product_description: { type: String },
  price: { type: String },
  imageUrl: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const productDetails = mongoose.model('products', product);

module.exports = productDetails;

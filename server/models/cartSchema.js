const mongoose = require('mongoose');

const cart = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, 
  quantity: { type: String },
  unit_price: { type: String },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const cartDetails = mongoose.model('cart_items', cart);

module.exports = cartDetails;

const mongoose = require('mongoose');

const orderItem = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'orders' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, 
  quantity: { type: String },
  unit_price: { type: String },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const orderItemDetails = mongoose.model('orderItems', orderItem);

module.exports = orderItemDetails;

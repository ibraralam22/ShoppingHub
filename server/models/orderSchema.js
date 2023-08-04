const mongoose = require('mongoose');

const order = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  order_date: { type: Date, default: Date.now() },
  total_amount: { type: String },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const orderDetails = mongoose.model('orders', order);

module.exports = orderDetails;

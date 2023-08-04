const mongoose = require('mongoose');

const category = new mongoose.Schema({
  category_name: { type: String, required: true },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const categoryDetails = mongoose.model('categories', category);

module.exports = categoryDetails;

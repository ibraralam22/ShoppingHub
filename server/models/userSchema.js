const mongoose = require('mongoose');

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const user = new mongoose.Schema({
  name: { type: String },
  age: { type: String },
  gender: { type: String },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: 'Password is required!!',
  },
  userRole: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User',
  },
});

const userDetails = mongoose.model('users', user);

module.exports = userDetails;

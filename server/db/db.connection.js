const mongoose = require('mongoose');

function DBConnection() {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(() => {
      console.log('Failed to connect to MongoDB');
    });
}

module.exports = DBConnection;

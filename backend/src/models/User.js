const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  singleImage: { type: String, required: true }, // Single image URL
  multipleImages: { type: [String], required: true }, // Array of multiple image URLs
});

module.exports = mongoose.model('User', userSchema);

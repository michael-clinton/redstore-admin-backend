const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g., "S", "M", "L", "XL"
  available: { type: Boolean, default: true }, // Indicates if the size is in stock
});

const FeaturedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
  singleImage: { type: String, required: true },
  multipleImages: [{ type: String }],
  sizes: [sizeSchema], // New sizes field
});


const Featured = mongoose.model("Featured", FeaturedSchema);

module.exports = Featured;


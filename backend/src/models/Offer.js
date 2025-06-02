const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, required: true }, // Stores the Cloudinary URL of the image
});

module.exports = mongoose.model("Offer", OfferSchema);

const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
    userImage: { type: String, required: true }, // image URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", TestimonialSchema);

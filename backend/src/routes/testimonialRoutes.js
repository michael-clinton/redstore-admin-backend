const express = require("express");
const Testimonial = require("../models/Testimonial");
const upload = require("../middleware/multer");
const uploadToCloudinary = require("../utils/cloudinaryUploader");

const router = express.Router();

// Upload testimonial
router.post(
  "/upload",
  upload.single("userImage"), // single image file field named 'userImage'
  async (req, res) => {
    try {
      const { userName, text, rating } = req.body;
      const userImageFile = req.file;

      if (!userName || !text || !rating || !userImageFile) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Upload user image to Cloudinary
      const userImageUrl = await uploadToCloudinary(userImageFile);

      // Create new testimonial
      const testimonial = new Testimonial({
        userName,
        text,
        rating,
        userImage: userImageUrl,
      });

      const savedTestimonial = await testimonial.save();

      res.status(201).json({ message: "Testimonial uploaded successfully", testimonial: savedTestimonial });
    } catch (err) {
      console.error("Error during testimonial upload:", err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }
);

// Get all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Delete testimonial by id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;

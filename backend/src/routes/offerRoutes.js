const express = require("express");
const Offer = require("../models/Offer");
const upload = require("../middleware/multer");
const uploadToCloudinary = require("../utils/cloudinaryUploader");

const router = express.Router();

// Create or update offer
router.post(
  "/offer",
  upload.single("image"), // Single image upload
  async (req, res) => {
    try {
      const { title, description, link } = req.body;

      if (!title || !description || !link) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check if an offer already exists
      const existingOffer = await Offer.findOne();

      let imageUrl = existingOffer?.image || ""; // Keep the current image if none is uploaded
      if (req.file) {
        // Upload new image to Cloudinary
        imageUrl = await uploadToCloudinary(req.file);
      }

      let offer;
      if (existingOffer) {
        // Update existing offer
        existingOffer.title = title;
        existingOffer.description = description;
        existingOffer.link = link;
        existingOffer.image = imageUrl;
        offer = await existingOffer.save();
      } else {
        // Create new offer
        offer = new Offer({
          title,
          description,
          link,
          image: imageUrl,
        });
        await offer.save();
      }

      res.status(201).json({ message: "Offer saved successfully", offer });
    } catch (err) {
      console.error("Error managing offer:", err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }
);

// Fetch offer
router.get("/offer-show", async (req, res) => {
  try {
    const offer = await Offer.findOne(); // Fetch the single offer document
    if (!offer) {
      return res.status(404).json({ message: "No offer found" });
    }
    res.status(200).json(offer);
  } catch (err) {
    console.error("Error fetching offer:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;

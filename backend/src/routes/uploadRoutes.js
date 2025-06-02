const express = require("express");
const Product = require("../models/Product");
const Featured = require("../models/Featured");
const upload = require("../middleware/multer");
const uploadToCloudinary = require("../utils/cloudinaryUploader");

const router = express.Router();

// Upload product
router.post(
  "/upload-all",
  upload.fields([
    { name: "singleImage", maxCount: 1 },
    { name: "multipleImages", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { name, price, rating, description, sizes, category } = req.body;

      const singleImageFile = req.files.singleImage ? req.files.singleImage[0] : null;
      const multipleImageFiles = req.files.multipleImages || [];

      // Validate after assigning singleImageFile
      if (!name || !price || !rating || !description || !singleImageFile || !category) {
        return res.status(400).json({ error: "All fields are required including category" });
      }

      // Upload images
      const singleImageUrl = await uploadToCloudinary(singleImageFile);
      const multipleImageUrls = await Promise.all(
        multipleImageFiles.map((file) => uploadToCloudinary(file))
      );

      const parsedSizes = JSON.parse(sizes);

      const product = new Product({
        name,
        price,
        rating,
        description,
        category,
        singleImage: singleImageUrl,
        multipleImages: multipleImageUrls,
        sizes: parsedSizes,
      });

      const savedProduct = await product.save();

      res.status(201).json({
        message: "Product uploaded successfully",
        product: savedProduct,
      });
    } catch (err) {
      console.error("Error during product upload:", err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }
);

router.post('/upload-featured', upload.fields([
  { name: 'singleImage', maxCount: 1 },
  { name: 'multipleImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const { name, price, rating, description } = req.body;
    const sizes = JSON.parse(req.body.sizes); // <-- Parse sizes here

    // Now use sizes array/object
    const singleImageUrl = await uploadToCloudinary(req.files.singleImage[0]);
    const multipleImagesUrls = [];
    if (req.files.multipleImages) {
      for (const file of req.files.multipleImages) {
        const url = await uploadToCloudinary(file);
        multipleImagesUrls.push(url);
      }
    }

    // Create your product document:
    const newProduct = new Featured({
      name,
      price,
      rating,
      description,
      singleImage: singleImageUrl,
      multipleImages: multipleImagesUrls,
      sizes, // <-- store parsed sizes here
    });

    await newProduct.save();
    res.status(201).json({ message: 'Featured product uploaded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require("express");
const Product = require("../models/Product");
const Featured = require("../models/Featured");
const upload = require("../middleware/multer");
const uploadToCloudinary = require("../utils/cloudinaryUploader");

const router = express.Router();

// Helper function for error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Fetch all products
router.get(
  "/products",
  asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.status(200).json(products);
  })
);

// Fetch all featured products
router.get(
  "/products/view-featured",
  asyncHandler(async (req, res) => {
    const featuredProducts = await Featured.find();
    if (featuredProducts.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }
    res.status(200).json(featuredProducts);
  })
);

// Fetch product by ID
router.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  })
);

// Delete product by ID
router.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  })
);

// Fetch featured product by ID
router.get(
  "/products/featured/:id",
  asyncHandler(async (req, res) => {
    const featuredProduct = await Featured.findById(req.params.id);
    if (!featuredProduct) {
      return res.status(404).json({ error: "Featured product not found" });
    }
    res.status(200).json(featuredProduct);
  })
);

// Delete featured product by ID
router.delete(
  "/products/featured/:id",
  asyncHandler(async (req, res) => {
    const deletedFeaturedProduct = await Featured.findByIdAndDelete(req.params.id);
    if (!deletedFeaturedProduct) {
      return res.status(404).json({ error: "Featured product not found" });
    }
    res.status(200).json({ message: "Featured product deleted successfully" });
  })
);

module.exports = router;

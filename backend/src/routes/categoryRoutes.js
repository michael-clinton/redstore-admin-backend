// backend/categories.js

const express = require("express");
const slugify = require("slugify");
const router = express.Router();
const Category = require("../models/Category");


// GET /categories - return all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // sorted by name
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST /categories - add a new category
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    const newCategory = new Category({ name, slug });

    await newCategory.save();
    res.status(201).json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Failed to add category", details: error.message });
  }
});

module.exports = router;

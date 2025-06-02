const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

categorySchema.pre("save", function(next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);

const mongoose = require('mongoose');

const UniqueVisitorSchema = new mongoose.Schema({
  ip: { type: String, required: true },       // Visitor identifier (e.g., IP)
  date: { type: Date, required: true },       // Date of visit (truncate to day)
});

UniqueVisitorSchema.index({ ip: 1, date: 1 }, { unique: true }); // unique ip per day

module.exports = mongoose.model('UniqueVisitor', UniqueVisitorSchema);

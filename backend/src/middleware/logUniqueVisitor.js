const UniqueVisitor = require('../models/UniqueVisitor'); // Adjust the path as needed

// Middleware to log unique visitors
const logUniqueVisitor = async (req, res, next) => {
  try {
    // Get the IP address from the request
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Get today's date, truncated to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert the unique visitor record
    await UniqueVisitor.updateOne(
      { ip, date: today }, // Match criteria (IP and date)
      { $set: { ip, date: today } }, // Update operation
      { upsert: true } // Create if it doesn't exist
    );

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error logging unique visitor:', error);
    next(); // Still proceed to avoid breaking the app
  }
};

module.exports = logUniqueVisitor;

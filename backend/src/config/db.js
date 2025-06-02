const mongoose = require("mongoose");

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    // Use the environment variable for the MongoDB connection string
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Parses MongoDB connection strings
      useUnifiedTopology: true, // Ensures a stable connection
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

module.exports = connectDB;

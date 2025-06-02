const cloudinary = require("../config/cloudinary");

/**
 * Uploads a file to Cloudinary and returns the secure URL.
 * @param {Object} file - The file to be uploaded (from multer).
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("Invalid file object. Ensure the file exists and has a buffer."));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" }, // Change "products" to your desired folder name in Cloudinary
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Write the file buffer to the upload stream
    uploadStream.end(file.buffer);
  });
};

module.exports = uploadToCloudinary;

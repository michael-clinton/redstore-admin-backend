const UserAdmin = require('../models/UserAdmin'); // adjust path as needed
const uploadToCloudinary = require('../utils/cloudinaryUploader'); // adjust path


const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserAdmin.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Update user profile by ID
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, bio, phone } = req.body;

    console.log('req.file:', req.file); // Debug: check if file is received

    let profileImageUrl = null;
    if (req.file) {
      profileImageUrl = await uploadToCloudinary(req.file);
      console.log('Cloudinary uploaded URL:', profileImageUrl);
    }

    const user = await UserAdmin.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (profileImageUrl) user.profileImage = profileImageUrl;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { getUserProfile, updateUserProfile};
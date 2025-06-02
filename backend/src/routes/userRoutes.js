const express = require('express');
const upload = require("../middleware/multer");
const { getUserProfile, updateUserProfile, uploadProfileImage} = require('../controller/UserController');

const router = express.Router();

// Routes
router.get('/profile/:id', getUserProfile); // Fetch user profile
router.put('/profile/:id', upload.single('profileImage'), updateUserProfile);


module.exports = router;

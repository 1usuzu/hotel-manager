const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, resetPassword, getProfile, updateProfile } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes - require authentication
router.use(authMiddleware); // Apply middleware to all routes below

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/reset-password', resetPassword); // Changed from POST to PUT for consistency

module.exports = router;

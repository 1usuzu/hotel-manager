const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, resetPassword, forgotPassword, getProfile, updateProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


// Các route cần xác thực
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);



module.exports = router;

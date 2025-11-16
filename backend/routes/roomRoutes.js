const express = require('express');
const router = express.Router();
const { searchRooms, getRoomDetails, addReview } = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

// Bất cứ ai cũng có thể tìm kiếm và xem chi tiết
router.get('/search', searchRooms);
router.get('/:id', getRoomDetails);

// Chỉ user đã đăng nhập mới được đánh giá
router.post('/:id/reviews', authMiddleware, addReview);

module.exports = router;

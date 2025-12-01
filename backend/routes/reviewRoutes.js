const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const {
  getAllReviews,
  getRoomReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
} = require('../controllers/reviewController')

// Public routes
router.get('/', getAllReviews) // Lấy tất cả đánh giá
router.get('/room/:roomId', getRoomReviews) // Lấy đánh giá của một phòng

// Protected routes - require authentication
router.use(authMiddleware)

router.post('/', createReview) // Tạo đánh giá mới
router.get('/my-reviews', getMyReviews) // Lấy đánh giá của mình
router.put('/:id', updateReview) // Sửa đánh giá của mình
router.delete('/:id', deleteReview) // Xóa đánh giá của mình

module.exports = router

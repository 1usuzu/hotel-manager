const express = require('express')
const router = express.Router()
const { searchRooms, getRoomDetails } = require('../controllers/roomController')

router.get('/search', searchRooms)
router.get('/:id', getRoomDetails)

// tạm thời bỏ route review
// router.post('/:id/reviews', addReview)

module.exports = router

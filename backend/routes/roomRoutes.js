const express = require('express');
const router = express.Router();
const {
  searchRooms,
  getRoomDetails,
  getRoomByNumber,
  getRecommendedRooms,
} = require('../controllers/roomController')

// Specific routes first (before /:id)
router.get('/search', searchRooms)
router.get('/recommendations', getRecommendedRooms)
router.get('/number/:roomNumber', getRoomByNumber)

// Generic routes last
router.get('/:id', getRoomDetails)

module.exports = router

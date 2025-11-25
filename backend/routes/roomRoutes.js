const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const {
  searchRooms,
  getRoomDetails,
  getRoomByNumber,
  getRecommendedRooms,
} = require('../controllers/roomController')

router.get('/search', searchRooms)
router.get('/number/:roomNumber', roomController.getRoomByNumber);
router.get('/recommendations', getRecommendedRooms);
router.get('/:id', getRoomDetails)
router.get('/:id', roomController.getRoomById)

module.exports = router

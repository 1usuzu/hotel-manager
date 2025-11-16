const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Tất cả các API booking đều yêu cầu đăng nhập
router.use(authMiddleware);

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.put('/:id/cancel', cancelBooking);

module.exports = router;

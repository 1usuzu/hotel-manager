const express = require('express');
const router = express.Router();
const { createPaymentUrl, vnpayReturn, vnpayIpn } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Client gọi API này để lấy URL
router.post('/create_payment_url', authMiddleware, createPaymentUrl);

// VNPay gọi về 2 URL này
router.get('/vnpay_return', vnpayReturn);
router.get('/vnpay_ipn', vnpayIpn);

module.exports = router;

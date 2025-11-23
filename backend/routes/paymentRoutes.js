// backend/routes/paymentRoutes.js
const express = require('express')
const router = express.Router()

const {
  createPaymentUrl,
  vnpayReturn,
  vnpayIpn,
  directPayment,
} = require('../controllers/paymentController')

const auth = require('../middleware/authMiddleware')

// Client tạo URL VNPay
router.post('/create_payment_url', auth, createPaymentUrl)

// VNPay callback
router.get('/vnpay_return', vnpayReturn)
router.get('/vnpay_ipn', vnpayIpn)

// Thanh toán trực tiếp
router.post('/direct', auth, directPayment)

module.exports = router

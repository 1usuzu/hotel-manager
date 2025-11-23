// src/api/paymentApi.js
import axios from './apiClient'

// Tạo URL VNPay
export const createVnpayPayment = (payload) =>
  axios.post('/payment/create_payment_url', payload)

// Thanh toán trực tiếp tại khách sạn
export const directPayment = (payload) =>
  axios.post('/payment/direct', payload)

// backend/controllers/paymentController.js
const crypto = require('crypto')
const qs = require('qs')
const Booking = require('../models/Booking')
const Payment = require('../models/Payment')
const Room = require('../models/Room')

require('dotenv').config()

function sortObject(obj) {
  const sorted = {}
  const keys = Object.keys(obj).sort()
  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+')
  })
  return sorted
}

// 1. TẠO URL THANH TOÁN VNPay – TÍNH TỔNG TIỀN THEO SỐ ĐÊM
exports.createPaymentUrl = async (req, res) => {
  try {
    const { booking_id } = req.body
    const user_id = req.user.id

    console.log('>>> createPaymentUrl body =', req.body, 'user =', req.user)

    // 1. Lấy booking + room, KHÔNG tin amount từ client
    const booking = await Booking.findOne({
      where: { booking_id, user_id },   // chỉ check id + user
      include: [{ model: Room }],
    })

    if (!booking) {
      console.log('>>> createPaymentUrl: booking not found', { booking_id, user_id })
      return res
        .status(404)
        .json({ error: 'Không tìm thấy đơn đặt phòng thuộc về bạn' })
    }

    // Optional: chặn trạng thái không hợp lệ
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res
        .status(400)
        .json({ error: 'Đơn này không thể thanh toán nữa' })
    }

    // 2. Tính số đêm & tổng tiền
    const checkInDate = new Date(booking.check_in)
    const checkOutDate = new Date(booking.check_out)
    const nights =
      (checkOutDate.getTime() - checkInDate.getTime()) /
      (1000 * 60 * 60 * 24)

    const roomPrice = Number(booking.Room.price || 0)
    const totalAmount = nights * roomPrice

    console.log(
      '>>> VNPay createPaymentUrl:',
      'booking_id =', booking_id,
      '| nights =', nights,
      '| roomPrice =', roomPrice,
      '| totalAmount =', totalAmount
    )

    // 3. Tạo bản ghi Payment
    const payment = await Payment.create({
      user_id,
      booking_id,
      amount: totalAmount,
      method: 'vnpay', // enum phải có 'vnpay'
      status: 'pending',
    })

    // 4. Tạo URL VNPay
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if (ipAddr === '::1' || ipAddr === '127.0.0.1') {
      ipAddr = '118.69.176.32'
    }

    const tmnCode = process.env.VNPAY_TMN_CODE
    const secretKey = process.env.VNPAY_HASH_SECRET
    let vnpUrl = process.env.VNPAY_URL
    const returnUrl = process.env.VNPAY_RETURN_URL

    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: payment.payment_id.toString(),
      vnp_OrderInfo: `Thanh toan don hang ${booking_id}`,
      vnp_OrderType: 'other',
      vnp_Amount: totalAmount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '')
        .replace(/-/g, '')
        .replace(/:/g, '')
        .replace(/ /g, ''),
    }

    const sortedParams = sortObject(vnpParams)
    const signData = qs.stringify(sortedParams, { encode: false })
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    sortedParams['vnp_SecureHash'] = signed
    vnpUrl += '?' + qs.stringify(sortedParams, { encode: false })

    console.log('>>> VNPay URL =', vnpUrl)

    return res.json({ paymentUrl: vnpUrl })
  } catch (err) {
    console.error('>>> createPaymentUrl error:', err)
    return res
      .status(500)
      .json({ error: 'Lỗi server khi tạo URL thanh toán' })
  }
}

// 2. vnpayReturn
exports.vnpayReturn = async (req, res) => {
  let vnpParams = req.query
  const secureHash = vnpParams['vnp_SecureHash']

  delete vnpParams['vnp_SecureHash']
  delete vnpParams['vnp_SecureHashType']

  vnpParams = sortObject(vnpParams)
  const secretKey = process.env.VNPAY_HASH_SECRET
  const signData = qs.stringify(vnpParams, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  const paymentId = vnpParams['vnp_TxnRef']
  const responseCode = vnpParams['vnp_ResponseCode']

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'

  // log debug
  console.log('>>> vnpayReturn paymentId =', paymentId)
  console.log('>>> vnpayReturn responseCode =', responseCode)

  // URL redirect về FRONTEND, không có /api/payment
  let redirectUrl = `${frontendUrl}/booking-result?paymentId=${paymentId}`

  if (secureHash === signed) {
    try {
      const payment = await Payment.findByPk(paymentId)
      if (!payment) {
        redirectUrl += '&success=false&message=PaymentNotFound'
        return res.redirect(redirectUrl)
      }

      if (payment.status === 'pending') {
        if (responseCode === '00') {
          await payment.update({ status: 'success' })

          const booking = await Booking.findByPk(payment.booking_id)
          await booking.update({
            status: 'confirmed',
            payment_id: payment.payment_id,
          })

          redirectUrl += '&success=true&message=PaymentSuccess'
        } else {
          await payment.update({ status: 'failed' })

          const booking = await Booking.findByPk(payment.booking_id)
          await booking.update({ status: 'cancelled' })

          redirectUrl += '&success=false&message=PaymentFailed'
        }
      } else {
        // IPN đã xử lý trước đó
        redirectUrl += '&success=true&message=AlreadyProcessed'
      }

      return res.redirect(redirectUrl)
    } catch (err) {
      console.error(err)
      redirectUrl += '&success=false&message=ServerError'
      return res.redirect(redirectUrl)
    }
  } else {
    redirectUrl += '&success=false&message=InvalidSignature'
    return res.redirect(redirectUrl)
  }
}


// 3. vnpayIpn
exports.vnpayIpn = async (req, res) => {
  let vnpParams = req.query
  const secureHash = vnpParams['vnp_SecureHash']

  delete vnpParams['vnp_SecureHash']
  delete vnpParams['vnp_SecureHashType']

  vnpParams = sortObject(vnpParams)
  const secretKey = process.env.VNPAY_HASH_SECRET
  const signData = qs.stringify(vnpParams, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  const paymentId = vnpParams['vnp_TxnRef']
  const responseCode = vnpParams['vnp_ResponseCode']

  if (secureHash === signed) {
    try {
      const payment = await Payment.findByPk(paymentId)
      if (!payment) {
        return res
          .status(200)
          .json({ RspCode: '01', Message: 'Order not found' })
      }

      if (payment.status !== 'pending') {
        return res.status(200).json({
          RspCode: '02',
          Message: 'Order already confirmed/failed',
        })
      }

      if (responseCode === '00') {
        await payment.update({ status: 'success' })
        const booking = await Booking.findByPk(payment.booking_id)
        await booking.update({
          status: 'confirmed',
          payment_id: payment.payment_id,
        })
      } else {
        await payment.update({ status: 'failed' })
        const booking = await Booking.findByPk(payment.booking_id)
        await booking.update({ status: 'cancelled' })
      }

      return res.status(200).json({ RspCode: '00', Message: 'Success' })
    } catch (err) {
      console.error(err)
      return res
        .status(200)
        .json({ RspCode: '97', Message: 'Server Error' })
    }
  } else {
    return res
      .status(200)
      .json({ RspCode: '97', Message: 'Invalid Signature' })
  }
}

// 4. Thanh toán trực tiếp
// 4. Thanh toán trực tiếp tại khách sạn
exports.directPayment = async (req, res) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ error: 'Thiếu booking_id' });
    }

    // 1. Tìm booking của chính user đang login
    const booking = await Booking.findOne({
      where: { booking_id, user_id: req.user.id },
      include: [{ model: Room }],
    });

    if (!booking) {
      return res.status(404).json({ error: 'Không tìm thấy booking' });
    }

    // Không cho thanh toán lại booking đã completed / cancelled
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res
        .status(400)
        .json({ error: 'Đơn này không thể thanh toán nữa' });
    }

    // 2. Tính lại số đêm + tổng tiền
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    const nights =
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

    const roomPrice = Number(booking.Room?.price || 0);
    const totalAmount = nights * roomPrice;

    // 3. Tạo bản ghi Payment method 'direct'
    const payment = await Payment.create({
      user_id: req.user.id,
      booking_id,
      amount: totalAmount,
      method: 'direct', // khớp enum('vnpay','direct') trong Payment model
      status: 'success',
    });

    // 4. Update booking thành confirmed
    booking.status = 'confirmed';
    await booking.save();

    return res.json({
      message:
        'Đã ghi nhận thanh toán trực tiếp. Đơn phòng đã được xác nhận.',
      booking,
      payment,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: 'Lỗi server khi thanh toán trực tiếp' });
  }
};

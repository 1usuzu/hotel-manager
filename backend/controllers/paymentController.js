const crypto = require('crypto');
const qs = require('qs');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
require('dotenv').config();

// Hàm sắp xếp object (bắt buộc của VNPay)
function sortObject(obj) {
  let sorted = {};
  let str = []; // This will hold the keys
  let key;

  // 1. Push all keys into array
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(key);
    }
  }

  // 2. Sort the keys alphabetically
  str.sort();

  // 3. Create the new sorted object with encoded values
  for (key = 0; key < str.length; key++) {
    let sortedKey = str[key]; // e.g., "vnp_Amount"
    let sortedValue = obj[sortedKey]; // e.g., 360000000

    // Encode the value
    sorted[sortedKey] = encodeURIComponent(sortedValue).replace(/%20/g, '+');
  }
  return sorted;
}

// 1. TẠO URL THANH TOÁN
exports.createPaymentUrl = async (req, res) => {
  try {
    const { booking_id, amount } = req.body;
    const user_id = req.user.id;

    // 1. Kiểm tra booking
    const booking = await Booking.findOne({ where: { booking_id, user_id, status: 'pending' } });
    if (!booking) {
      return res.status(404).json({ error: 'Không tìm thấy đơn đặt phòng đang chờ' });
    }

    // 2. Tạo giao dịch thanh toán (Payment)
    const payment = await Payment.create({
      user_id,
      booking_id,
      amount,
      status: 'pending',
    });

    // 3. Cấu hình VNPay
let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Cho VNPAY sandbox khi test trên localhost
    if (ipAddr === '::1' || ipAddr === '127.0.0.1') {
      // Dùng 1 IP public fake để test
      ipAddr = '118.69.176.32';
    }
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    let vnpUrl = process.env.VNPAY_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: payment.payment_id.toString(), // Dùng payment_id làm mã giao dịch
      vnp_OrderInfo: `Thanh toan don hang ${booking_id}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay yêu cầu nhân 100 (vì đơn vị là đồng)
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, '').replace(/:/g, '').replace(/ /g, ''), // YYYYMMDDHHMMSS
      // vnp_BankCode: 'NCB' // (Tùy chọn)
    };

    const sortedParams = sortObject(vnpParams);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sortedParams['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(sortedParams, { encode: false });

    res.json({ paymentUrl: vnpUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server khi tạo URL thanh toán' });
  }
};

// 2. NHẬN KẾT QUẢ TỪ BROWSER
exports.vnpayReturn = async (req, res) => {
  let vnpParams = req.query;
  const secureHash = vnpParams['vnp_SecureHash'];

  delete vnpParams['vnp_SecureHash'];
  delete vnpParams['vnp_SecureHashType'];

  vnpParams = sortObject(vnpParams);
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const signData = qs.stringify(vnpParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  const paymentId = vnpParams['vnp_TxnRef'];
  const responseCode = vnpParams['vnp_ResponseCode'];
  const frontendUrl = process.env.FRONTEND_URL;

  // URL redirect về frontend
  let redirectUrl = `${frontendUrl}/booking-result?paymentId=${paymentId}&`;

  if (secureHash === signed) {
    try {
      const payment = await Payment.findByPk(paymentId);
      if (!payment) {
        return res.redirect(`${redirectUrl}success=false&message=PaymentNotFound`);
      }

      // Chỉ cập nhật nếu đang là 'pending'
      if (payment.status === 'pending') {
        if (responseCode === '00') {
          // THÀNH CÔNG
          await payment.update({ status: 'success' });

          // Cập nhật booking
          const booking = await Booking.findByPk(payment.booking_id);
          await booking.update({ status: 'confirmed', payment_id: payment.payment_id });

          redirectUrl += 'success=true&message=PaymentSuccess';
        } else {
          // THẤT BẠI (ví dụ: hủy, thiếu tiền...)
          await payment.update({ status: 'failed' });

          // Hủy booking
          const booking = await Booking.findByPk(payment.booking_id);
          await booking.update({ status: 'cancelled' });

          redirectUrl += 'success=false&message=PaymentFailed';
        }
      } else {
        // Đã được IPN xử lý rồi
        redirectUrl += 'success=true&message=AlreadyProcessed';
      }

      res.redirect(redirectUrl);

    } catch (err) {
      console.error(err);
      res.redirect(`${redirectUrl}success=false&message=ServerError`);
    }
  } else {
    // Sai chữ ký
    res.redirect(`${redirectUrl}success=false&message=InvalidSignature`);
  }
};

// 3. NHẬN KẾT QUẢ TỪ SERVER (IPN)
exports.vnpayIpn = async (req, res) => {
  let vnpParams = req.query;
  const secureHash = vnpParams['vnp_SecureHash'];

  delete vnpParams['vnp_SecureHash'];
  delete vnpParams['vnp_SecureHashType'];

  vnpParams = sortObject(vnpParams);
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const signData = qs.stringify(vnpParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  const paymentId = vnpParams['vnp_TxnRef'];
  const responseCode = vnpParams['vnp_ResponseCode'];

  if (secureHash === signed) {
    try {
      const payment = await Payment.findByPk(paymentId);
      if (!payment) {
        return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      }

      if (payment.status !== 'pending') {
        return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed/failed' });
      }

      // Xử lý CSDL (giống hệt vnpayReturn)
      if (responseCode === '00') {
        await payment.update({ status: 'success' });
        const booking = await Booking.findByPk(payment.booking_id);
        await booking.update({ status: 'confirmed', payment_id: payment.payment_id });
      } else {
        await payment.update({ status: 'failed' });
        const booking = await Booking.findByPk(payment.booking_id);
        await booking.update({ status: 'cancelled' });
      }

      // Phản hồi cho VNPay
      res.status(200).json({ RspCode: '00', Message: 'Success' });

    } catch (err) {
      console.error(err);
      res.status(200).json({ RspCode: '97', Message: 'Server Error' });
    }
  } else {
    // Sai chữ ký
    res.status(200).json({ RspCode: '97', Message: 'Invalid Signature' });
  }
};

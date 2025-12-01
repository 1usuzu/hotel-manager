const Booking = require('../models/Booking')
const Room = require('../models/Room')
const { Op } = require('sequelize')
const Payment = require('../models/Payment');


// Đặt phòng
exports.createBooking = async (req, res) => {
  try {
    const { room_id, check_in, check_out } = req.body
    const user_id = req.user.id

    // Validate required fields
    if (!room_id || !check_in || !check_out) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' })
    }

    // Validate room_id
    const roomId = Number(room_id)
    if (isNaN(roomId) || roomId < 1) {
      return res.status(400).json({ error: 'ID phòng không hợp lệ' })
    }

    // Validate dates
    const checkInDate = new Date(check_in)
    const checkOutDate = new Date(check_out)

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ error: 'Ngày không hợp lệ' })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      return res
        .status(400)
        .json({ error: 'Ngày check-in không thể ở trong quá khứ' })
    }

    if (checkOutDate <= checkInDate) {
      return res
        .status(400)
        .json({ error: 'Ngày check-out phải sau ngày check-in' })
    }

    // Validate booking duration (max 30 days)
    const nights =
      (checkOutDate.getTime() - checkInDate.getTime()) /
      (1000 * 60 * 60 * 24)

    if (nights > 30) {
      return res
        .status(400)
        .json({ error: 'Không thể đặt phòng quá 30 ngày' })
    }

    // Kiểm tra phòng có tồn tại và available
    const room = await Room.findByPk(roomId)
    if (!room) {
      return res.status(404).json({ error: 'Không tìm thấy phòng' })
    }

    if (room.status !== 'available') {
      return res.status(400).json({ error: 'Phòng không khả dụng' })
    }

    // Check trùng lịch
    const existingBooking = await Booking.findOne({
      where: {
        room_id: roomId,
        status: { [Op.ne]: 'cancelled' },
        check_in: { [Op.lt]: checkOutDate },
        check_out: { [Op.gt]: checkInDate },
      },
    })

    if (existingBooking) {
      return res
        .status(400)
        .json({ error: 'Phòng đã được đặt trong khoảng thời gian này' })
    }

    // Tạo booking
    const booking = await Booking.create({
      user_id,
      room_id: roomId,
      check_in: checkInDate,
      check_out: checkOutDate,
      status: 'confirmed',
    })

    // Tính tổng tiền
    const totalAmount = nights * parseFloat(room.price)

    // Lấy booking kèm thông tin phòng
    const bookingWithRoom = await Booking.findByPk(booking.booking_id, {
      include: [Room],
    })

    return res.status(201).json({
      message: 'Tạo đơn đặt phòng thành công. Chuyển sang thanh toán.',
      booking: bookingWithRoom,
      totalAmount,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi đặt phòng' })
  }
}

// (Khách hàng) Xem lịch sử đặt phòng của mình
// (Khách hàng) Xem lịch sử đặt phòng của mình
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: Room },
        { model: Payment, required: false }, // có thể chưa thanh toán
      ],
      order: [['check_in', 'DESC']],
    });

    return res.json(bookings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi server' });
  }
};


// (Khách hàng) Hủy 1 đơn đặt phòng
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id)

    if (isNaN(bookingId) || bookingId < 1) {
      return res.status(400).json({ error: 'ID booking không hợp lệ' })
    }

    const booking = await Booking.findOne({
      where: {
        booking_id: bookingId,
        user_id: req.user.id,
      },
    })

    if (!booking) {
      return res.status(404).json({
        error: 'Không tìm thấy đơn đặt phòng hoặc bạn không có quyền',
      })
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        error: 'Không thể hủy đơn đặt phòng ở trạng thái này',
      })
    }

    // Không cho hủy nếu check-in trong vòng 24h
    const checkInDate = new Date(booking.check_in)
    const now = new Date()
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntilCheckIn < 24 && hoursUntilCheckIn > 0) {
      return res.status(400).json({
        error: 'Không thể hủy đơn trong vòng 24 giờ trước check-in',
      })
    }

    booking.status = 'cancelled'
    await booking.save()

    return res.json({ message: 'Hủy đặt phòng thành công', booking })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server' })
  }
}

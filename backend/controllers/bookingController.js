const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { Op } = require('sequelize');

// Đặt phòng
exports.createBooking = async (req, res) => {
  try {
    const { room_id, check_in, check_out } = req.body;
    const user_id = req.user.id; // Lấy từ middleware

    // 1. Kiểm tra ngày hợp lệ
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set về đầu ngày

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: 'Ngày check-out phải sau ngày check-in' });
    }
    if (checkInDate < today) {
       return res.status(400).json({ error: 'Ngày check-in không thể ở trong quá khứ' });
    }

    // 2. Kiểm tra phòng có tồn tại không
    const room = await Room.findByPk(room_id);
    if (!room) return res.status(404).json({ error: 'Không tìm thấy phòng' });
    if (room.status !== 'available') return res.status(400).json({ error: 'Phòng này hiện không có sẵn' });

    // 3. Logic cốt lõi: Kiểm tra phòng có bị trùng lịch không
    const existingBooking = await Booking.findOne({
      where: {
        room_id: room_id,
        status: { [Op.ne]: 'cancelled' }, // Không phải là đơn đã hủy
        // Logic xung đột: (O_in < N_out) AND (O_out > N_in)
        check_in: { [Op.lt]: checkOutDate },
        check_out: { [Op.gt]: checkInDate }
      }
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Phòng đã được đặt trong khoảng thời gian này.' });
    }

    // 4. Tạo booking (status: 'pending')
    const booking = await Booking.create({
      user_id,
      room_id,
      check_in: checkInDate,
      check_out: checkOutDate,
      status: 'pending' // Chờ thanh toán hoặc chờ admin xác nhận
    });

 // 5. Tính tổng tiền
    const nights = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);
    const totalAmount = nights * parseFloat(room.price);

    // Trả về booking và totalAmount để client dùng cho bước tiếp theo
    res.status(201).json({
      message: 'Tạo đơn đặt phòng thành công. Chuyển sang thanh toán.',
      booking,
      totalAmount // Gửi tổng tiền về
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server khi đặt phòng' });
  }
};

// (Khách hàng) Xem lịch sử đặt phòng của mình
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { user_id: req.user.id },
            include: [Room], // Lấy cả thông tin phòng
            order: [['check_in', 'DESC']] // Sắp xếp theo ngày check-in mới nhất
        });
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

// (Khách hàng) Hủy 1 đơn đặt phòng
exports.cancelBooking = async (req, res) => {
    try {
        // 1. Kiểm tra quyền: Phải là chủ của booking
        const booking = await Booking.findOne({
            where: {
                booking_id: req.params.id,
                user_id: req.user.id // Quan trọng!
            }
        });

        if (!booking) return res.status(404).json({ error: 'Không tìm thấy đơn đặt phòng hoặc bạn không có quyền' });

        // 2. Logic nghiệp vụ: Chỉ được hủy đơn 'pending' hoặc 'confirmed'
        if (booking.status === 'completed' || booking.status === 'cancelled') {
             return res.status(400).json({ error: 'Không thể hủy đơn đặt phòng ở trạng thái này' });
        }

        // (Logic nâng cao: Nếu status là 'confirmed', có thể cần gọi API hoàn tiền)

        booking.status = 'cancelled';
        await booking.save();
        res.json({ message: 'Hủy đặt phòng thành công', booking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

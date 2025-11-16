const Room = require('../models/Room');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { Op } = require('sequelize');

// Tìm kiếm và xem danh sách phòng
exports.searchRooms = async (req, res) => {
  try {
    const {
      type,       // Loại phòng (VIP, Standard...)
      minPrice,   // Giá thấp nhất
      maxPrice,   // Giá cao nhất
      capacity,   // Sức chứa
      checkIn,    // Ngày nhận
      checkOut    // Ngày trả
    } = req.query;

    let whereClause = {
      status: 'available' // Luôn luôn chỉ tìm phòng 'available'
    };

    // 1. Lọc theo tiêu chí cơ bản
    if (type) whereClause.type = type;
    if (capacity) whereClause.capacity = { [Op.gte]: capacity }; // Sức chứa >= yêu cầu
    if (minPrice) whereClause.price = { [Op.gte]: minPrice };
    if (maxPrice) whereClause.price = { ...whereClause.price, [Op.lte]: maxPrice };

    // 2. Lọc nâng cao theo ngày (checkIn, checkOut)
    if (checkIn && checkOut) {
      // 2.1. Tìm tất cả các phòng "BẬN" (conflicting)
      const conflictingBookings = await Booking.findAll({
        where: {
          status: { [Op.ne]: 'cancelled' }, // (pending, confirmed, completed)
          // Logic xung đột: (O_in < N_out) AND (O_out > N_in)
          check_in: { [Op.lt]: new Date(checkOut) },
          check_out: { [Op.gt]: new Date(checkIn) }
        },
        attributes: ['room_id'] // Chỉ cần lấy ID phòng
      });

      // 2.2. Lấy danh sách ID các phòng "BẬN"
      const busyRoomIds = conflictingBookings.map(b => b.room_id);

      // 2.3. Thêm điều kiện: KHÔNG nằm trong danh sách "BẬN"
      if (busyRoomIds.length > 0) {
        whereClause.room_id = { [Op.notIn]: busyRoomIds };
      }
    }

    // 3. Thực thi query
    const rooms = await Room.findAll({ where: whereClause });
    res.json(rooms);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server khi tìm kiếm phòng' });
  }
};

// Xem chi tiết 1 phòng
exports.getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id, {
      include: [Review] // Lấy cả các đánh giá của phòng (nếu association đã được định nghĩa)
    });
    if (!room) {
      return res.status(404).json({ error: 'Không tìm thấy phòng' });
    }
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// (Khách hàng) Thêm đánh giá cho phòng
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const room_id = req.params.id;
        const user_id = req.user.id; // Lấy từ middleware

        // 1. Kiểm tra rating hợp lệ
        if (!rating || rating < 1 || rating > 5) {
          return res.status(400).json({ error: 'Vui lòng cung cấp điểm rating từ 1 đến 5' });
        }

        // 2. Logic nghiệp vụ: Kiểm tra xem user đã từng ở phòng này VÀ đã checkout (completed)
        const completedBooking = await Booking.findOne({
          where: {
            user_id: user_id,
            room_id: room_id,
            status: 'completed'
          }
        });

        if (!completedBooking) {
          return res.status(403).json({ error: 'Bạn chỉ có thể đánh giá phòng này sau khi hoàn thành kỳ nghỉ.' });
        }

        // (Tùy chọn: Kiểm tra xem user đã review phòng này cho booking này chưa để tránh spam)

        // 3. Tạo review
        const review = await Review.create({
            user_id,
            room_id,
            rating,
            comment
        });
        res.status(201).json(review);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi server khi thêm đánh giá' });
    }
};

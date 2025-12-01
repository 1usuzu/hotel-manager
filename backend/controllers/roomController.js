// controllers/roomController.js
const { Op } = require('sequelize')
const Room = require('../models/Room')
const Booking = require('../models/Booking')

function parseDateFromQuery(str) {
  if (!str) return null;

  // Hỗ trợ dạng dd/mm hoặc dd/mm/yyyy
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 2) {
      // vd: 27/11 -> dùng năm hiện tại
      const [d, m] = parts.map((x) => Number(x));
      if (!d || !m) return null;
      const year = new Date().getFullYear();
      return new Date(year, m - 1, d);
    }
    if (parts.length === 3) {
      const [d, m, y] = parts.map((x) => Number(x));
      if (!d || !m || !y) return null;
      return new Date(y, m - 1, d);
    }
    return null;
  }

  // Nếu là yyyy-mm-dd
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

exports.searchRooms = async (req, res) => {
  try {
    let { type, minPrice, maxPrice, capacity, checkIn, checkOut } = req.query

    // Trim inputs
    type = type?.trim()
    checkIn = checkIn?.trim()
    checkOut = checkOut?.trim()

    const whereRoom = {}

    // Validate and filter by type
    if (type) {
      whereRoom.type = type
    }

    // Validate and filter by capacity
    if (capacity) {
      const cap = Number(capacity)
      if (isNaN(cap) || cap < 1) {
        return res.status(400).json({ error: 'Sức chứa không hợp lệ' })
      }
      whereRoom.capacity = { [Op.gte]: cap }
    }

    // Validate and filter by price
    if (minPrice) {
      const min = Number(minPrice)
      if (isNaN(min) || min < 0) {
        return res.status(400).json({ error: 'Giá tối thiểu không hợp lệ' })
      }
      whereRoom.price = {
        ...(whereRoom.price || {}),
        [Op.gte]: min,
      }
    }

    if (maxPrice) {
      const max = Number(maxPrice)
      if (isNaN(max) || max < 0) {
        return res.status(400).json({ error: 'Giá tối đa không hợp lệ' })
      }
      whereRoom.price = {
        ...(whereRoom.price || {}),
        [Op.lte]: max,
      }
    }

    // Validate min <= max
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      return res.status(400).json({ error: 'Giá tối thiểu phải nhỏ hơn giá tối đa' })
    }

    // Lọc theo tình trạng: chỉ lấy phòng available
    whereRoom.status = 'available'

    // Nếu có checkIn/checkOut: loại phòng đã được đặt trùng
    if (checkIn && checkOut) {
      const inDate = parseDateFromQuery(checkIn)
      const outDate = parseDateFromQuery(checkOut)

      if (!inDate || !outDate) {
        return res
          .status(400)
          .json({ error: 'Ngày check-in/check-out không hợp lệ' })
      }

      if (outDate <= inDate) {
        return res
          .status(400)
          .json({ error: 'Ngày trả phòng phải sau ngày nhận phòng' })
      }

      // Không cho đặt phòng trong quá khứ
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (inDate < today) {
        return res
          .status(400)
          .json({ error: 'Ngày check-in không thể ở trong quá khứ' })
      }

      const booked = await Booking.findAll({
        where: {
          status: { [Op.ne]: 'cancelled' },
          check_in: { [Op.lt]: outDate },
          check_out: { [Op.gt]: inDate },
        },
        attributes: ['room_id'],
      })

      const bookedRoomIds = [...new Set(booked.map((b) => b.room_id))]

      if (bookedRoomIds.length > 0) {
        whereRoom.room_id = { [Op.notIn]: bookedRoomIds }
      }
    }

    const rooms = await Room.findAll({
      where: whereRoom,
      order: [['price', 'ASC']],
    })

    return res.json(rooms)
  } catch (err) {
    console.error('>>> searchRooms error:', err)
    return res.status(500).json({ error: 'Lỗi server khi tìm phòng' })
  }
}

exports.getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id)

    if (!room) {
      return res.status(404).json({ error: 'Không tìm thấy phòng' })
    }

    return res.json(room)
  } catch (err) {
    console.error('>>> getRoomDetails error:', err)
    return res.status(500).json({ error: 'Lỗi server khi lấy chi tiết phòng' })
  }
}

// DÙNG BOOKINGPAGE: lấy phòng theo "key" (ưu tiên số phòng, fallback sang id)
exports.getRoomByNumber = async (req, res) => {
  try {
    const { roomNumber } = req.params
    if (!roomNumber) {
      return res
        .status(400)
        .json({ error: 'Thiếu tham số roomNumber trong request.' })
    }

    // 1. Tìm theo room_number (string)
    let room = await Room.findOne({ where: { room_number: String(roomNumber) } });

    // 2. Nếu không thấy, thử tìm theo ID (nếu là số)
    if (!room && !Number.isNaN(Number(roomNumber))) {
       room = await Room.findByPk(Number(roomNumber));
    }

    if (!room) {
      return res
        .status(404)
        .json({ exists: false, error: 'Không tìm thấy phòng.' })
    }

    return res.json({
      exists: true,
      room_id: room.room_id,
      room_number: room.room_number,
      type: room.type,
      price: room.price,
      status: room.status,
      capacity: room.capacity,
      image_url: room.image_url,
      name: room.name,
    })
  } catch (err) {
    console.error('getRoomByNumber error:', err)
    return res.status(500).json({ error: 'Lỗi server.' })
  }
}


// Gợi ý phòng cho HomePage - tạm thời dựa trên DB
// TODO: sau này có thể gọi AI service để xếp hạng theo lịch sử người dùng
exports.getRecommendedRooms = async (req, res) => {
  try {
    let limit = Number(req.query.limit) || 6

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 100) {
      limit = 6
    }

    const whereRoom = {
      status: 'available',
    }

    const rooms = await Room.findAll({
      where: whereRoom,
      order: [['price', 'ASC']],
      limit,
    })

    return res.json(rooms)
  } catch (err) {
    console.error('>>> getRecommendedRooms error:', err)
    return res
      .status(500)
      .json({ error: 'Lỗi server khi gợi ý phòng' })
  }
}

exports.getRoomById = async (req, res) => {
  try {
    const roomId = Number(req.params.id)
    if (!roomId) {
      return res.status(400).json({ error: 'Thiếu roomId hợp lệ' })
    }

    const room = await Room.findByPk(roomId)

    if (!room) {
      return res.status(404).json({ error: 'Không tìm thấy phòng.' })
    }

    return res.json({
      exists: true,
      room_id: room.room_id,
      room_number: room.room_number,
      type: room.type,
      price: room.price,
      status: room.status,
      capacity: room.capacity,
      image_url: room.image_url,
      name: room.name,
    })
  } catch (err) {
    console.error('getRoomById error:', err)
    return res.status(500).json({ error: 'Lỗi server.' })
  }
}

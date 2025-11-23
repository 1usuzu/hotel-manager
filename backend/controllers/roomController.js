// controllers/roomController.js
const { Op } = require('sequelize')
const Room = require('../models/Room')
const Booking = require('../models/Booking')

// Tìm phòng với filter optional
exports.searchRooms = async (req, res) => {
  try {
    // log để debug FE gửi gì lên
    console.log('>>> searchRooms req.query =', req.query)

    let { type, minPrice, maxPrice, capacity, checkIn, checkOut } = req.query

    const whereRoom = {}

    if (type) {
      // nhớ: giá trị type phải khớp DB, ví dụ 'Standard', 'VIP', 'Family'
      whereRoom.type = type
    }

    if (capacity) {
      whereRoom.capacity = { [Op.gte]: Number(capacity) }
    }

    if (minPrice || maxPrice) {
      const priceCond = {}
      if (minPrice) priceCond[Op.gte] = Number(minPrice)
      if (maxPrice) priceCond[Op.lte] = Number(maxPrice)
      whereRoom.price = priceCond
    }

    if (checkIn && checkOut) {
      const inDate = new Date(checkIn)
      const outDate = new Date(checkOut)

      if (inDate >= outDate) {
        return res
          .status(400)
          .json({ error: 'Ngày trả phòng phải sau ngày nhận phòng' })
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

    console.log('>>> searchRooms whereRoom =', whereRoom)

    const rooms = await Room.findAll({
      where: whereRoom,
      order: [['price', 'ASC']],
    })

    console.log('>>> searchRooms rooms.length =', rooms.length)

    return res.json(rooms)
  } catch (err) {
    console.error('>>> searchRooms error:', err)
    return res.status(500).json({ error: 'Lỗi server khi tìm phòng' })
  }
}

// Xem chi tiết 1 phòng
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

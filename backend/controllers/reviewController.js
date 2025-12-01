const Review = require('../models/Review')
const Room = require('../models/Room')
const User = require('../models/User')
const Booking = require('../models/Booking')
const { Op } = require('sequelize')

// Lấy tất cả đánh giá (public)
exports.getAllReviews = async (req, res) => {
  try {
    const { room_id, limit = 50, offset = 0 } = req.query

    const where = {}
    if (room_id) {
      const roomIdNum = Number(room_id)
      if (isNaN(roomIdNum) || roomIdNum < 1) {
        return res.status(400).json({ error: 'room_id không hợp lệ' })
      }
      where.room_id = roomIdNum
    }

    const reviews = await Review.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'email'],
        },
        {
          model: Room,
          attributes: ['room_id', 'room_number', 'name', 'type'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: Math.min(Number(limit), 100),
      offset: Number(offset),
    })

    return res.json(reviews)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi lấy đánh giá' })
  }
}

// Lấy đánh giá của một phòng cụ thể
exports.getRoomReviews = async (req, res) => {
  try {
    const roomId = Number(req.params.roomId)

    if (isNaN(roomId) || roomId < 1) {
      return res.status(400).json({ error: 'room_id không hợp lệ' })
    }

    const reviews = await Review.findAll({
      where: { room_id: roomId },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username'],
        },
      ],
      order: [['created_at', 'DESC']],
    })

    return res.json(reviews)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi lấy đánh giá phòng' })
  }
}

// Tạo đánh giá mới (yêu cầu đăng nhập)
exports.createReview = async (req, res) => {
  try {
    const { room_id, rating, comment } = req.body
    const user_id = req.user.id

    // Validate required fields
    if (!room_id || !rating) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' })
    }

    // Validate room_id
    const roomId = Number(room_id)
    if (isNaN(roomId) || roomId < 1) {
      return res.status(400).json({ error: 'room_id không hợp lệ' })
    }

    // Validate rating
    const ratingNum = Number(rating)
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Đánh giá phải từ 1-5 sao' })
    }

    // Validate comment length
    if (comment && comment.length > 1000) {
      return res
        .status(400)
        .json({ error: 'Bình luận không được quá 1000 ký tự' })
    }

    // Kiểm tra phòng có tồn tại không
    const room = await Room.findByPk(roomId)
    if (!room) {
      return res.status(404).json({ error: 'Không tìm thấy phòng' })
    }

    // Kiểm tra user đã đánh giá phòng này chưa
    const existingReview = await Review.findOne({
      where: {
        user_id,
        room_id: roomId,
      },
    })

    if (existingReview) {
      return res.status(400).json({ error: 'Bạn đã đánh giá phòng này rồi' })
    }

    // Optional: Kiểm tra user đã từng đặt phòng này chưa
    const hasBooked = await Booking.findOne({
      where: {
        user_id,
        room_id: roomId,
        status: { [Op.in]: ['confirmed', 'completed'] },
      },
    })

    if (!hasBooked) {
      return res.status(400).json({
        error: 'Bạn chỉ có thể đánh giá phòng đã từng đặt',
      })
    }

    // Tạo review
    const review = await Review.create({
      user_id,
      room_id: roomId,
      rating: ratingNum,
      comment: comment?.trim() || null,
    })

    // Lấy review với thông tin user
    const reviewWithUser = await Review.findByPk(review.review_id, {
      include: [
        {
          model: User,
          attributes: ['user_id', 'username'],
        },
      ],
    })

    return res.status(201).json({
      message: 'Tạo đánh giá thành công',
      review: reviewWithUser,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi tạo đánh giá' })
  }
}

// Cập nhật đánh giá của mình
exports.updateReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.id)
    const { rating, comment } = req.body
    const user_id = req.user.id

    if (isNaN(reviewId) || reviewId < 1) {
      return res.status(400).json({ error: 'review_id không hợp lệ' })
    }

    const review = await Review.findByPk(reviewId)

    if (!review) {
      return res.status(404).json({ error: 'Không tìm thấy đánh giá' })
    }

    // Chỉ cho phép user sửa đánh giá của chính mình
    if (review.user_id !== user_id) {
      return res
        .status(403)
        .json({ error: 'Bạn không có quyền sửa đánh giá này' })
    }

    // Validate rating nếu có
    if (rating !== undefined) {
      const ratingNum = Number(rating)
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: 'Đánh giá phải từ 1-5 sao' })
      }
      review.rating = ratingNum
    }

    // Validate comment nếu có
    if (comment !== undefined) {
      if (comment && comment.length > 1000) {
        return res
          .status(400)
          .json({ error: 'Bình luận không được quá 1000 ký tự' })
      }
      review.comment = comment?.trim() || null
    }

    await review.save()

    const updatedReview = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          attributes: ['user_id', 'username'],
        },
      ],
    })

    return res.json({
      message: 'Cập nhật đánh giá thành công',
      review: updatedReview,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi cập nhật đánh giá' })
  }
}

// Xóa đánh giá của mình
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.id)
    const user_id = req.user.id

    if (isNaN(reviewId) || reviewId < 1) {
      return res.status(400).json({ error: 'review_id không hợp lệ' })
    }

    const review = await Review.findByPk(reviewId)

    if (!review) {
      return res.status(404).json({ error: 'Không tìm thấy đánh giá' })
    }

    // Chỉ cho phép user xóa đánh giá của chính mình
    if (review.user_id !== user_id) {
      return res
        .status(403)
        .json({ error: 'Bạn không có quyền xóa đánh giá này' })
    }

    await review.destroy()

    return res.json({ message: 'Xóa đánh giá thành công' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi xóa đánh giá' })
  }
}

// Lấy đánh giá của user hiện tại
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Room,
          attributes: ['room_id', 'room_number', 'name', 'type'],
        },
      ],
      order: [['created_at', 'DESC']],
    })

    return res.json(reviews)
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ error: 'Lỗi server khi lấy đánh giá của bạn' })
  }
}

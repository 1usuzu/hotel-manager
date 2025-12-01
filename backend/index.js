// backend/index.js
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const sequelize = require('./config/db')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Models
const User = require('./models/User')
const Room = require('./models/Room')
const Booking = require('./models/Booking')
const Review = require('./models/Review')
const Payment = require('./models/Payment')

// Database Associations
User.hasMany(Booking, { foreignKey: 'user_id' })
Booking.belongsTo(User, { foreignKey: 'user_id' })

Room.hasMany(Booking, { foreignKey: 'room_id' })
Booking.belongsTo(Room, { foreignKey: 'room_id' })

Room.hasMany(Review, { foreignKey: 'room_id' })
Review.belongsTo(Room, { foreignKey: 'room_id' })

User.hasMany(Review, { foreignKey: 'user_id' })
Review.belongsTo(User, { foreignKey: 'user_id' })

User.hasMany(Payment, { foreignKey: 'user_id' })
Payment.belongsTo(User, { foreignKey: 'user_id' })

Booking.hasOne(Payment, { foreignKey: 'booking_id' })
Payment.belongsTo(Booking, { foreignKey: 'booking_id' })

// API Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/rooms', require('./routes/roomRoutes'))
app.use('/api/bookings', require('./routes/bookingRoutes'))
app.use('/api/payment', require('./routes/paymentRoutes'))

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Hotel Manager API',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route không tồn tại' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Lỗi server' })
})

// Database connection and server start
const PORT = process.env.PORT || 4000

sequelize
  .authenticate()
  .then(() => {
    console.log('✓ Kết nối database thành công')
    return sequelize.sync({ alter: true })
  })
  .then(() => {
    console.log('✓ Đồng bộ database thành công')
    app.listen(PORT, () => {
      console.log(`✓ Server đang chạy tại http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('✗ Lỗi khởi động server:', err)
    process.exit(1)
  })

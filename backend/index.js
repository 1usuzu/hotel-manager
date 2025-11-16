const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Models và Associations
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const Payment = require('./models/Payment');

// Định nghĩa quan hệ
// User có nhiều Bookings
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

// Room có nhiều Bookings
Room.hasMany(Booking, { foreignKey: 'room_id' });
Booking.belongsTo(Room, { foreignKey: 'room_id' });

// Room có nhiều Reviews
Room.hasMany(Review, { foreignKey: 'room_id' });
Review.belongsTo(Room, { foreignKey: 'room_id' });

// User có nhiều Reviews
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

// User - Payment (1-N)
User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

// Booking - Payment (1-1)
Booking.hasOne(Payment, { foreignKey: 'booking_id' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

// Kết nối và Đồng bộ DB
sequelize.authenticate()
  .then(() => {
    console.log('Kết nối Supabase PostgreSQL thành công');
    // Dùng { alter: true } để cập nhật schema
    // Bỏ trống nếu chỉ muốn tạo bảng nếu chưa tồn tại
    sequelize.sync({ alter: true })
      .then(() => console.log('Đã đồng bộ CSDL.'))
      .catch(err => console.error('Lỗi đồng bộ CSDL:', err));
  })
  .catch(err => console.error('Lỗi kết nối DB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);

// Khởi động server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));

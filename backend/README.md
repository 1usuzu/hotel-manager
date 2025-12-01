# Hotel Manager Backend API

Backend API cho hệ thống quản lý khách sạn.

## Công nghệ sử dụng

- **Node.js** + **Express.js** - Framework backend
- **Sequelize** - ORM cho PostgreSQL
- **PostgreSQL** (Supabase) - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **VNPay** - Payment gateway

## Cấu trúc thư mục

```
backend/
├── config/          # Cấu hình database
├── controllers/     # Business logic
├── middleware/      # Authentication middleware
├── models/          # Database models
├── routes/          # API routes
├── .env            # Environment variables
└── index.js        # Entry point
```

## Cài đặt

```bash
npm install
```

## Cấu hình

Tạo file `.env` với nội dung:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=4000

# VNPay Config
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:4000/api/payment/vnpay_return
FRONTEND_URL=http://localhost:3000
```

## Chạy server

```bash
# Production
npm start

# Development (với nodemon)
npm run dev
```

Server sẽ chạy tại `http://localhost:4000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Đăng ký tài khoản
- `POST /login` - Đăng nhập
- `GET /profile` - Xem thông tin cá nhân (auth required)
- `PUT /profile` - Cập nhật thông tin (auth required)
- `PUT /reset-password` - Đổi mật khẩu (auth required)

### Rooms (`/api/rooms`)
- `GET /search` - Tìm kiếm phòng
- `GET /recommendations` - Gợi ý phòng
- `GET /number/:roomNumber` - Lấy phòng theo số phòng
- `GET /:id` - Lấy chi tiết phòng

### Bookings (`/api/bookings`)
- `POST /` - Tạo đơn đặt phòng (auth required)
- `GET /my-bookings` - Xem lịch sử đặt phòng (auth required)
- `PUT /:id/cancel` - Hủy đơn đặt phòng (auth required)

### Payment (`/api/payment`)
- `POST /create_payment_url` - Tạo URL thanh toán VNPay (auth required)
- `POST /direct` - Thanh toán trực tiếp (auth required)
- `GET /vnpay_return` - VNPay callback
- `GET /vnpay_ipn` - VNPay IPN

## Database Models

### User
- user_id, username, email, phone, password, role, created_at

### Room
- room_id, room_number, type, price, status, description, capacity, image_url, name

### Booking
- booking_id, user_id, room_id, check_in, check_out, status, payment_id

### Payment
- payment_id, user_id, booking_id, amount, method, status

### Review
- review_id, user_id, room_id, rating, comment, created_at

## Validation Rules

### User
- Username: 2-100 ký tự
- Email: Format hợp lệ, unique
- Password: 6-100 ký tự
- Phone: 10-11 số (optional)

### Room
- Room number: Unique
- Price: > 0
- Capacity: 1-20 người

### Booking
- Check-out > Check-in
- Max 30 ngày
- Không đặt trong quá khứ
- Không hủy trong vòng 24h trước check-in

### Payment
- Amount: > 0

## Security

- JWT authentication cho protected routes
- Password hashing với bcrypt (10 salt rounds)
- Input validation và sanitization
- SQL injection protection (Sequelize ORM)
- CORS enabled

## Error Handling

API trả về JSON với format:
```json
{
  "error": "Error message",
  "errorCode": "ERROR_CODE" // optional
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

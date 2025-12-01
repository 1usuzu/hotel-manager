const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
  // Kiểm tra JWT_SECRET có tồn tại không
  if (!process.env.JWT_SECRET) {
    console.error('CRITICAL: JWT_SECRET is not defined in environment variables');
    return res.status(500).json({ error: 'Lỗi cấu hình server' });
  }

  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Không có token, vui lòng đăng nhập.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token không hợp lệ.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Validate payload structure
    if (!payload.id || typeof payload.id !== 'number') {
      return res.status(401).json({
        error: 'Token không hợp lệ.',
        errorCode: 'INVALID_PAYLOAD'
      });
    }

    // payload được set ở authController.login: { id, role }
    req.user = {
      id: payload.id,
      role: payload.role || 'customer',
    };

    return next();
  } catch (err) {
    console.error('>>> authMiddleware verify error:', err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
        errorCode: 'TOKEN_EXPIRED',
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token không hợp lệ.',
        errorCode: 'TOKEN_INVALID',
      });
    }

    return res.status(401).json({
      error: 'Lỗi xác thực token.',
      errorCode: 'AUTH_ERROR',
    });
  }
};

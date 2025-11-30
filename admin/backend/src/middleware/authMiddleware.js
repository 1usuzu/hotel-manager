const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Truy cập bị từ chối. Không có token.' });
  }

  // Token thường có dạng "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Định dạng token không hợp lệ.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Sẽ chứa { id: user_id, role: user_role }
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token không hợp lệ.' });
  }
};
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối DB
sequelize.authenticate()
  .then(() => console.log('Kết nối Supabase PostgreSQL thành công'))
  .catch(err => console.error('Lỗi kết nối DB:', err));

// Route
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));

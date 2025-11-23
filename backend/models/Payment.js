const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    }
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bookings',
      key: 'booking_id',
    }
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  method: {
    type: DataTypes.ENUM('vnpay', 'direct'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed'),
    defaultValue: 'pending',
  }
}, {
  tableName: 'payments',
  timestamps: true, // Thêm timestamps cho giao dịch
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Payment;

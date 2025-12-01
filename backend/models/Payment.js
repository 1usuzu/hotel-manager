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
    },
    validate: {
      notNull: {
        msg: 'user_id không được để trống'
      }
    }
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bookings',
      key: 'booking_id',
    },
    validate: {
      notNull: {
        msg: 'booking_id không được để trống'
      }
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Số tiền không được để trống'
      },
      min: {
        args: [0],
        msg: 'Số tiền phải lớn hơn 0'
      }
    }
  },
  method: {
    type: DataTypes.ENUM('vnpay', 'direct'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Phương thức thanh toán không được để trống'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed'),
    defaultValue: 'pending',
  }
}, {
  tableName: 'payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['booking_id']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Payment;

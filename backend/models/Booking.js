const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  booking_id: {
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
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rooms',
      key: 'room_id',
    },
    validate: {
      notNull: {
        msg: 'room_id không được để trống'
      }
    }
  },
  check_in: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Ngày check-in không được để trống'
      },
      isDate: {
        msg: 'Ngày check-in không hợp lệ'
      }
    }
  },
  check_out: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Ngày check-out không được để trống'
      },
      isDate: {
        msg: 'Ngày check-out không hợp lệ'
      },
      isAfterCheckIn(value) {
        if (this.check_in && value <= this.check_in) {
          throw new Error('Ngày check-out phải sau ngày check-in');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending',
  },
  payment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['room_id']
    },
    {
      fields: ['check_in', 'check_out']
    }
  ]
});

module.exports = Booking;

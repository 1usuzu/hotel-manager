const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
  review_id: {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Đánh giá không được để trống'
      },
      min: {
        args: [1],
        msg: 'Đánh giá tối thiểu là 1 sao'
      },
      max: {
        args: [5],
        msg: 'Đánh giá tối đa là 5 sao'
      }
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Bình luận không được quá 1000 ký tự'
      }
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'reviews',
  timestamps: false,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['room_id']
    },
    {
      fields: ['rating']
    }
  ]
});

module.exports = Review;

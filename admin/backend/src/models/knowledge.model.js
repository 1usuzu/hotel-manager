const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Knowledge = sequelize.define("Knowledge", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  embedding: {
    type: DataTypes.ARRAY(DataTypes.FLOAT), 
    allowNull: false,
  },
}, {
  tableName: "knowledge_base",
  timestamps: false,
});

module.exports = Knowledge;

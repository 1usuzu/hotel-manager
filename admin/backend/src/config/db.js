const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("Lỗi: Không tìm thấy biến DATABASE_URL trong file .env!");
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize.authenticate()
  .then(() => console.log("Admin Backend: DB Connected Successfully"))
  .catch(err => console.error("Admin Backend: DB Connection Failed:", err));

module.exports = sequelize;

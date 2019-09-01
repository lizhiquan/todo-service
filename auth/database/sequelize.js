const dotenv = require('dotenv');
const Sequelize = require('sequelize');

dotenv.config();

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  pool: {
    max: process.env.DB_CONNECTION_LIMIT || 10
  },
  define: {
    underscored: true
  }
};

const sequelize = new Sequelize(config);

module.exports = sequelize;
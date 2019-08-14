const mysql = require('mysql2');
const dotenv = require('dotenv');
const bluebird = require('bluebird');

dotenv.config();

const config = {
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

module.exports = mysql
  .createPool(config)
  .promise(bluebird);

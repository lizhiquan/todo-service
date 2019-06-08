const mysql = require('mysql2');
const dotenv = require('dotenv');
const bluebird = require('bluebird');

dotenv.config();

module.exports = mysql
  .createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
  .promise(bluebird);

const mysql = require('mysql');
const dotenv = require('dotenv');
const Promise = require('bluebird');

dotenv.config();

exports.pool = Promise.promisifyAll(
  mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
);

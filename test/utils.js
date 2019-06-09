const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });

const fs = require('fs');
const mysql = require('mysql2');
const bluebird = require('bluebird');

const readFile = bluebird.promisify(fs.readFile);

exports.query = sql => {
  const connection = mysql
    .createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    })
    .promise(bluebird);
  return connection.query(sql).finally(() => connection.end());
};

exports.resetDatabase = () => {
  return readFile('./bin/db-script.sql', 'utf8').then(sql => this.query(sql));
};

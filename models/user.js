const db = require('../database/index');
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.create = (username, password) => {
  return bcrypt.hash(password, saltRounds).then(hash => {
    const user = { username: username, password: hash };
    return db.query('INSERT INTO user SET ?', user);
  });
};

exports.authenticate = (username, password) => {
  return db
    .query('SELECT password FROM user WHERE username = ?', username)
    .then(([rows, fields]) => {
      if (rows && rows.length) {
        const hash = rows[0].password;
        return bcrypt.compare(password, hash);
      }
      return false;
    });
};

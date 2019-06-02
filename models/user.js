const db = require('../database/index');
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.create = (username, password) => {
  return bcrypt.hash(password, saltRounds).then(hash => {
    const user = { username: username, password: hash };
    return db.queryAsync('INSERT INTO user SET ?', user);
  });
};

exports.authenticate = (username, password) => {
  return db
    .queryAsync('SELECT password FROM user WHERE username = ?', username)
    .then(results => {
      const hash = results[0].password;
      return bcrypt.compare(password, hash);
    });
};

const sequelize = require('../database/sequelize');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

const saltRounds = 10;

const Model = Sequelize.Model;
class User extends Model {}
User.init(
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        is: /^[a-zA-Z0-9]+$/,
        min: 6,
        max: 20
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    sequelize
  }
);

exports.create = (username, password) => {
  return bcrypt.hash(password, saltRounds).then(hash => {
    const user = { username: username, password: hash };
    return User.create(user);
  });
};

exports.authenticate = (username, password) => {
  return User.findAll({
    where: {
      username: username
    }
  }).then(rows => {
    if (rows && rows.length) {
      const hash = rows[0].password;
      return bcrypt.compare(password, hash);
    }
    return false;
  });
};

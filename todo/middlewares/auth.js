const HttpStatus = require('http-status-codes');
const axios = require('axios');
const logger = require('../config/winston');

exports.authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Invalid authentication format.' });
  }
  
  const token = auth.split('Bearer ')[1];
  axios
    .post(`${process.env.AUTH_HOST}:${process.env.AUTH_PORT}/token/verify`, {
      token: token
    })
    .then(response => {
      req.username = response.data.username;
      next();
    })
    .catch(error => {
      logger.error(error);
      res.sendStatus(error.response.status);
    });
};

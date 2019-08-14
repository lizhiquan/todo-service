const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Invalid authentication format.' });
  }

  const token = auth.split('Bearer ')[1];
  jwt.verify(token, process.env.SECRET, (error, decoded) => {
    if (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
    } else {
      req.username = decoded.username;
      next();
    }
  });
};

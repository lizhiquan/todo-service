const express = require('express');
const HttpStatus = require('http-status-codes');
const User = require('../models/user');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use(express.json());

// POST /user
// Create a new user with username and password
router.post(
  '/',
  [
    check('username')
      .isLength({ min: 6, max: 20 })
      .withMessage('must be from 6 to 20 chars long')
      .matches(/^[a-zA-Z0-9]+$/),
    check('password')
      .isLength({ min: 6 })
      .withMessage('must be at least 6 chars long')
      .matches(/\d/)
      .withMessage('must contain a number')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ success: false, error: errors.array() });
    }

    const { username, password } = req.body;
    User.create(username, password)
      .then(() => res.status(HttpStatus.CREATED).json({ success: true }))
      .catch(error => {
        // TODO: Logger
        if (error.code === 'ER_DUP_ENTRY') {
          res
            .status(HttpStatus.CONFLICT)
            .json({ success: false, error: 'Username is already in use.' });
        } else {
          console.error(error);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });
        }
      });
  }
);

// POST /user/auth
// Authenticate a user with username and password
router.post(
  '/auth',
  [
    check('username').isLength({ min: 6, max: 20 }),
    check('password').isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ success: false, error: errors.array() });
    }

    const { username, password } = req.body;
    User.authenticate(username, password)
      .then(authenticated => {
        if (authenticated) {
          const token = jwt.sign({ username: username }, process.env.SECRET, {
            expiresIn: process.env.TOKEN_EXPIRES_IN
          });
          res.status(HttpStatus.OK).json({ success: true, token: token });
        } else {
          res.status(HttpStatus.UNAUTHORIZED).json({ success: false });
        }
      })
      .catch(error => {
        // TODO: Logger
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });
      });
  }
);

module.exports = router;

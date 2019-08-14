const express = require('express');
const HttpStatus = require('http-status-codes');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { reduceValidationErrors } = require('../helpers/validation');

const router = express.Router();

router.use(express.json());

/**
 * POST /token/verify
 * Verify json web token
 */
router.post(
  '/verify',
  [
    check('token')
      .isJWT()
      .withMessage('must be a JWT')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: reduceValidationErrors(errors)
      });
    }

    const { token } = req.body;
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
      } else {
        const username = decoded.username;
        res
          .status(HttpStatus.OK)
          .json({ username: username });
      }
    });
  }
);

module.exports = router;

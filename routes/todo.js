const express = require('express');
const HttpStatus = require('http-status-codes');
const ToDo = require('../models/todo');
const { authenticate } = require('../middlewares/auth');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

router.use(express.json());
router.use(authenticate);

/**
 * GET /todo
 * Get a list of todo items
 * - limit: maximum number of returned items
 * - offset: number of skipped items
 */
router.get('/', (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;
  ToDo.get(req.username, limit, offset)
    .then(results => {
      res.status(HttpStatus.OK).json({ success: true, data: results });
    })
    .catch(error => {
      // TODO: Logger
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });
    });
});

/**
 * POST /todo
 * Create a new todo item
 * - title: item title
 */
router.post('/', check('title').exists({ checkFalsy: true }), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .json({ success: false, error: errors.array() });
  }

  ToDo.create(req.username, req.body.title)
    .then(() => {
      res.status(HttpStatus.CREATED).json({ success: true });
    })
    .catch(error => {
      // TODO: Logger
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });
    });
});

/**
 * PUT /todo/:id
 * Update an existing todo item
 * - id: the id of a todo item
 * - title: item title
 * - done: indicates the item is done or not
 */
router.put(
  '/:id',
  [check('title').exists({ checkFalsy: true }), check('done').exists()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({ success: false, error: errors.array() });
    }

    ToDo.update(req.params.id, req.username, req.body.title, req.body.done)
      .then(() => {
        res.status(HttpStatus.OK).json({ success: true });
      })
      .catch(error => {
        // TODO: Logger
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });
      });
  }
);

/**
 * DELETE /todo/:id
 * Delete an existing todo item
 * - id: the id of a todo item
 */
router.delete('/:id', (req, res) => {
  ToDo.delete(req.params.id, req.username)
    .then(() => {
      res.status(HttpStatus.OK).json({ success: true });
    })
    .catch(error => {
      // TODO: Logger
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });
    });
});

module.exports = router;

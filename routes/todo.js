const express = require('express');
const HttpStatus = require('http-status-codes');
const ToDo = require('../models/todo');
const { authenticate } = require('../middlewares/auth');
const { check, validationResult } = require('express-validator/check');
const { reduceValidationErrors } = require('../helpers/validation');
const logger = require('../config/winston');

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
      const data = results.map(x => ({
        id: x.id,
        title: x.title,
        done: x.done[0] === 1,
        created: x.created,
        modified: x.modified
      }));
      res.status(HttpStatus.OK).json({ data: data });
    })
    .catch(error => {
      logger.error(error);
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
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
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: reduceValidationErrors(errors)
    });
  }

  ToDo.create(req.username, req.body.title)
    .then(() => {
      res.sendStatus(HttpStatus.CREATED);
    })
    .catch(error => {
      logger.error(error);
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
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
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: reduceValidationErrors(errors)
      });
    }

    ToDo.update(req.params.id, req.username, req.body.title, req.body.done)
      .then(() => {
        res.sendStatus(HttpStatus.OK);
      })
      .catch(error => {
        logger.error(error);
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
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
      res.sendStatus(HttpStatus.OK);
    })
    .catch(error => {
      logger.error(error);
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    });
});

module.exports = router;

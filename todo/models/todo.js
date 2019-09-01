const db = require('../database/index');

exports.get = (username, limit, offset) => {
  const query = `
    SELECT *
    FROM todo
    WHERE username=?
    ORDER BY created DESC
    LIMIT ?
    OFFSET ?
  `;
  return db
    .query(query, [username, parseInt(limit), parseInt(offset)])
    .then(([rows, fields]) => rows);
};

exports.create = (username, title) => {
  const item = {
    title: title,
    done: 0,
    username: username
  };
  return db.query('INSERT INTO todo SET ?', item);
};

exports.update = (id, username, title, done) => {
  const query = `
    UPDATE todo
    SET title=?, done=?
    WHERE id=? AND username=?
  `;
  return db.query(query, [title, done ? 1 : 0, id, username]);
};

exports.delete = (id, username) => {
  const query = `
    DELETE FROM todo
    WHERE id=? AND username=?
  `;
  return db.query(query, [id, username]);
};

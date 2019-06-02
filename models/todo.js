const db = require('../database/index');

exports.get = (username, limit, offset) => {
  const query = `
    SELECT *
    FROM todo_item
    WHERE username=?
    ORDER BY created DESC
    LIMIT ?
    OFFSET ?
  `;
  return db.queryAsync(query, [username, parseInt(limit), parseInt(offset)]);
};

exports.create = (username, title) => {
  const created = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  const item = {
    title: title,
    done: 0,
    created: created,
    username: username
  };
  return db.queryAsync('INSERT INTO todo_item SET ?', item);
};

exports.update = (id, username, title, done) => {
  const query = `
    UPDATE todo_item
    SET title=?, done=?, modified=?
    WHERE id=? AND username=?
  `;
  const modified = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  return db.queryAsync(query, [title, done ? 1 : 0, modified, id, username]);
};

exports.delete = (id, username) => {
  const query = `
    DELETE FROM todo_item
    WHERE id=? AND username=?
  `;
  return db.queryAsync(query, [id, username]);
};

const app = require('./app');
const db = require('./database/index');
const fs = require('fs');
const bluebird = require('bluebird');
const readFile = bluebird.promisify(fs.readFile);

const port = process.env.PORT || 3001;

db.getConnection()
  .then(() => readFile('./bin/schema.sql', 'utf8'))
  .then(sql => db.query(sql))
  .then(() =>
    app.listen(port, () => {
      console.log('Database connection has been established successfully.');
      console.log('Todo service is listening on port ' + port);
    })
  )
  .catch(error => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  });

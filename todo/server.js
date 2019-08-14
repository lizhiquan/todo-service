const app = require('./app');
const db = require('./database/index');

const port = process.env.PORT || 3001;

db.getConnection()
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

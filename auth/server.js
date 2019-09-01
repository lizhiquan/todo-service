const app = require('./app');
const db = require('./database/sequelize');

const port = process.env.PORT || 3000;

db.authenticate()
  .then(() => db.sync())
  .then(() =>
    app.listen(port, () => {
      console.log('Database connection has been established successfully.');
      console.log('Auth service is listening on port ' + port);
    })
  )
  .catch(error => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  });

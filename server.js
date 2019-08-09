const app = require('./app');
const db = require('./database/index');

const port = process.env.PORT || 3000;

db.getConnection()
  .then(() =>
    app.listen(port, () => {
      console.log('Todo service is listening on port ' + port);
    })
  )
  .catch(error => console.error(error));

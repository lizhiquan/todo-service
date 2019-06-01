const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use('/user', require('./routes/user'));

app.listen(port, () => {
  console.log('Todo service is listening on port ' + port);
});

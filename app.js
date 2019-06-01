const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use('/user', require('./routes/user'));
app.use('/todo', require('./routes/todo'));

app.listen(port, () => {
  console.log('Todo service is listening on port ' + port);
});

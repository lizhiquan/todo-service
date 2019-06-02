const express = require('express');

const app = express();

app.use('/user', require('./routes/user'));
app.use('/todo', require('./routes/todo'));

module.exports = app;
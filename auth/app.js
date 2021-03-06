const express = require('express');
const morgan = require('morgan');
const winston = require('./config/winston');

const app = express();

app.use(morgan('combined', { stream: winston.stream }));

app.use('/user', require('./routes/user'));

module.exports = app;

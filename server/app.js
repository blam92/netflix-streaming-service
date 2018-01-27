const express = require('express');
let app = express();
let router = require('./routes');

app.use('/', router);

module.exports = app;
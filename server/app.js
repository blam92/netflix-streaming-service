const express = require('express');
let app = express();
let router = require('./routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', router);

module.exports = app;
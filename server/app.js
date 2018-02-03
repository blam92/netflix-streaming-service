require('newrelic');
const express = require('express');
let app = express();
let router = require('./routes');
const pid = process.pid;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({instance: pid});
});

app.use('/', router);

module.exports = app;
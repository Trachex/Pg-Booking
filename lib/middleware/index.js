const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

require('./postgres');

const index = require('../routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', index);

app.use((req, res) => {
    res.status(404).send('404')
});
  
process.on('uncaughtException', (err) => {
    console.log(err);
    process.exit(1);
});

module.exports = app;
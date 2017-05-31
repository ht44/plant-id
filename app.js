//
'use strict';
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();

// npm modules
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const request = require('request');
fs.readFile('./temp.json', (err, data) => {
  request({
    url: 'https://identity.open.softlayer.com/v3/auth/tokens',
    body: data,
    method: 'POST'
  }, (err, response) => {
    console.log(response.headers['x-subject-token']);
    app.set('storageToken', response.headers['x-subject-token']);
  });
});

// all environments
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.use('/api', require('./routes/api.js'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('*', function(req, res, next) {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')})
});

http.createServer(app).listen(app.get('port'), '0.0.0.0', () => {
    console.log('Express server listening on port ' + app.get('port'));
});
//

//
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const request = require('request');

// APP
const app = express();

///////////////////////////////////////////////////////////////////////////////
// GET STORAGE TOKEN
///////////////////////////////////////////////////////////////////////////////

fs.readFile('./storage_auth.json', (err, data) => {
  request({
    url: 'https://identity.open.softlayer.com/v3/auth/tokens',
    body: data,
    method: 'POST'
  }, (err, response) => {
    app.set('storageToken', response.headers['x-subject-token']);
  });
});


///////////////////////////////////////////////////////////////////////////////
// MIDDLEWARE ATTACH
///////////////////////////////////////////////////////////////////////////////

// all environments
app.set('port', process.env.PORT || 8000);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/api', require('./routes/api.js'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

///////////////////////////////////////////////////////////////////////////////
// SINGLE PAGE
///////////////////////////////////////////////////////////////////////////////

app.use('*', function(req, res, next) {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')})
});

///////////////////////////////////////////////////////////////////////////////
// BOOT SERVER
///////////////////////////////////////////////////////////////////////////////

http.createServer(app).listen(app.get('port'), '0.0.0.0', () => {
    console.log('Express server listening on port ' + app.get('port'));
});
//

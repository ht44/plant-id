//

'use strict';

const express = require('express');
const routes = require('./routes');
const user = require('./routes/user');
const admin = require('./routes/admin');
const auth = require('./routes/auth');
const http = require('http');
const path = require('path');

const app = express();

// npm modules
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.use('/login', auth);
app.use('/api', admin);

app.get('/', (req, res) => {
  res.redirect('/login');
});

http.createServer(app).listen(app.get('port'), '0.0.0.0', () => {
    console.log('Express server listening on port ' + app.get('port'));
});

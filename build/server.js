'use strict';

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  OpenShift sample Node application
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    devPort = 4000,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
        mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
            mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    }
}

if (!mongoURL) {
    mongoURL = 'mongodb://localhost:27017/paytm';
}

// Connect to mongodb
var connect = function connect() {
    mongoose.connect(mongoURL);
};
connect();
var db = mongoose.connection;
db.on('error', function (error) {
    console.log("Error loading the db - " + error);
});
db.once('open', function () {
    console.log('Connected to mongodb server: ' + mongoURL);
});
db.on('disconnected', function () {
    console.log("MongoDB is not connected");
});

app.use('/', express.static(_path2.default.join(__dirname, './../public')));
app.use('/api', _routes2.default);

app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, '../public/index.html'));
});

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handling
app.use(function (err, req, res) {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message,
        error: err
    });
});

app.listen(port, ip, function () {
    console.log('Server running on http://%s:%s', ip, port);
});

if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    var config = require('../webpack.dev.config');
    var compiler = webpack(config);
    var devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(devPort, function () {
        console.log('webpack-dev-server is listening on port', devPort);
    });
}

module.exports = app;
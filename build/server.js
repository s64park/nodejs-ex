'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.app = undefined;

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./config');
require('./db/mongoose');
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var cookieParser = require('cookie-parser');

var app = express();
var port = process.env.PORT;
var devPort = 4000;

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', express.static(_path2.default.join(__dirname, './../public')));
app.use('/api', _routes2.default);

app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, '../public/index.html'));
});

// error handling
app.use(function (err, req, res) {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message,
        error: err
    });
});

app.listen(port, function () {
    console.log('Server running on http://%s:%s', port);
});

if (process.env.NODE_ENV == 'development') {
    var webpack = require('webpack');
    var WebpackDevServer = require('webpack-dev-server');
    console.log('Server is running on development mode');
    var config = require('../webpack.dev.config');
    var compiler = webpack(config);
    var devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(devPort, function () {
        console.log('webpack-dev-server is listening on port', devPort);
    });
}

exports.app = app;
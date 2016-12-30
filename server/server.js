//  OpenShift sample Node application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
import api from './routes';
import path from 'path';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    devPort = 4000,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
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
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}

if (!mongoURL) {
    mongoURL = 'mongodb://localhost:27017/paytm';
}

// Connect to mongodb
var connect = function () {
    mongoose.connect(mongoURL);
};
connect();
const db = mongoose.connection;
db.on('error', function(error) { console.log("Error loading the db - "+ error); });
db.once('open', () => { console.log('Connected to mongodb server: ' + mongoURL); });
db.on('disconnected', function() { console.log("MongoDB is not connected"); });

app.use('/', express.static(path.join(__dirname, './../public')));
app.use('/api', api);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handling
app.use(function(err, req, res) {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message,
        error: err
    });
});

app.listen(port, ip, function() {
    console.log('Server running on http://%s:%s', ip, port);
});

if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}

module.exports = app ;

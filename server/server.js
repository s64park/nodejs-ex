require('./config');
require('./db/mongoose');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
import api from './routes';
import path from 'path';
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT;
const devPort = 4000;


app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, './../public')));
app.use('/api', api);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// error handling
app.use(function(err, req, res) {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message,
        error: err
    });
});

app.listen(port, function() {
    console.log('Server running on http://%s:%s', port);
});

if(process.env.NODE_ENV == 'development') {
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
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

export {app};

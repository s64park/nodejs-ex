'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by Terry on 2017-01-27.
 */
var mongoose = require('mongoose');

/* mongodb connection */
// mongoose.connect('mongodb://username:password@host:port/database=');
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
  console.log('Connected to mongodb server ' + process.env.MONGODB_URI);
});

exports.default = mongoose;
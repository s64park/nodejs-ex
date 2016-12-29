'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _admin = require('./admin');

var _admin2 = _interopRequireDefault(_admin);

var _employee = require('./employee');

var _employee2 = _interopRequireDefault(_employee);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Terry on 2016-12-14.
 */
var router = _express2.default.Router();

router.use('/', _auth2.default);
router.use('/admin', _admin2.default);
router.use('/employee', _employee2.default);

exports.default = router;
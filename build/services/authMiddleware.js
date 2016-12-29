'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.adminAuth = adminAuth;
exports.employeeAuth = employeeAuth;

var _admin = require('../models/admin');

var _admin2 = _interopRequireDefault(_admin);

var _employee = require('../models/employee');

var _employee2 = _interopRequireDefault(_employee);

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Terry on 2016-12-20.
 */
function adminAuth(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var decode = void 0;
    if (token) {
        // decode token and verify
        try {
            decode = _jwtSimple2.default.decode(token, _config2.default.secret);
        } catch (e) {
            return res.status(401).send({ error: "Failed to authenticate token." });
        }
        _admin2.default.findById(decode.sub, function (err, admin) {
            if (err) {
                return next(err);
            }
            if (!admin) {
                return res.status(401).send({ error: "Invalid Token" });
            }
            if (decode.iat < new Date().getTime()) {
                return res.status(401).send({ error: "Token has been expired" });
            }
            return next();
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            error: "No token provided"
        });
    }
}

function employeeAuth(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var decode = void 0;
    if (token) {
        // decode token and verify
        try {
            decode = _jwtSimple2.default.decode(token, _config2.default.secret);
        } catch (e) {
            return res.status(401).send({ error: "Failed to authenticate token." });
        }
        _employee2.default.findById(decode.sub, function (err, admin) {
            if (err) {
                return next(err);
            }
            if (!admin) {
                return res.status(401).send({ error: "Invalid Token" });
            }
            if (decode.iat < new Date().getTime()) {
                return res.status(401).send({ error: "Token has been expired" });
            }
            return next();
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            error: "No token provided"
        });
    }
}
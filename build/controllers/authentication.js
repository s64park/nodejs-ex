'use strict';

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _employee = require('../models/employee');

var _employee2 = _interopRequireDefault(_employee);

var _admin = require('../models/admin');

var _admin2 = _interopRequireDefault(_admin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tokenForUser(user) {
    var date = new Date();
    date.setHours(date.getHours() + 1);
    var timestamp = date.getTime();
    return _jwtSimple2.default.encode({ sub: user._id, iat: timestamp }, process.env.JWT_SECRET);
}

exports.signin = function (req, res, next) {
    var _req$body = req.body,
        username = _req$body.username,
        password = _req$body.password;

    _admin2.default.findOne({ username: username }, function (err, admin) {
        if (err) {
            return next(err);
        }
        if (!admin) {
            //find if username is employee
            _employee2.default.findOne({ username: username }, function (err, employee) {
                if (err) {
                    return next(err);
                }
                if (!employee) {
                    return res.status(400).send({ error: "username and password does not match" });
                }

                if (employee.validateHash(password)) {
                    return res.json({
                        status: 'employee', token: tokenForUser(employee), name: employee.firstname + ' ' + employee.lastname, id: employee._id });
                } else {
                    return res.status(400).send({ error: "username and password does not match" });
                }
            });
        } else {
            if (admin.validateHash(password)) {
                return res.json({
                    status: 'admin', token: tokenForUser(admin), name: admin.firstname + ' ' + admin.lastname });
            } else {
                return res.status(400).send({ error: "username and password does not match" });
            }
        }
    });
};
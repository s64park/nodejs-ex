'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _authMiddleware = require('../services/authMiddleware');

var express = require('express');
var Employee = require('../controllers/employee');


var router = express.Router();

router.route('/:employeeId').all(_authMiddleware.employeeAuth).get(Employee.getEmployeeFeedbacks);

router.route('/:employeeId/:feedbackId').all(_authMiddleware.employeeAuth).put(Employee.saveFeedback).post(Employee.submitFeedback);

exports.default = router;
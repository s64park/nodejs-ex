'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _authMiddleware = require('../services/authMiddleware');

/**
 * Created by Terry on 2016-11-28.
 */
var express = require('express');
var Admin = require('../controllers/admin');

var router = express.Router();

router.route('/').get(_authMiddleware.adminAuth, Admin.getEmployees).post(_authMiddleware.adminAuth, Admin.addEmployee);

router.route('/:employeeId').all(_authMiddleware.adminAuth).get(Admin.getEmployee).put(Admin.updateEmployee).delete(Admin.deleteEmployee);

router.route('/performanceReview/:employeeId').all(_authMiddleware.adminAuth).get(Admin.getPerformanceReview).put(Admin.updatePerformanceReview);

router.route('/feedback/:employeeId').all(_authMiddleware.adminAuth).get(Admin.getFeedbacks);

router.route('/feedback/:assignedEmployeeId/:employeeId').all(_authMiddleware.adminAuth).put(Admin.assignFeedback).delete(Admin.unassignFeedback);

exports.default = router;
'use strict';

var _employee = require('../models/employee');

var _employee2 = _interopRequireDefault(_employee);

var _feedback = require('../models/feedback');

var _feedback2 = _interopRequireDefault(_feedback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Terry on 2016-12-19.
 */
exports.getEmployeeFeedbacks = function (req, res, next) {
    var employeeId = req.params.employeeId;
    _employee2.default.findById(employeeId).populate('submittedFeedbacks').populate('requiringFeedbacks').exec(function (err, employee) {
        if (err) {
            return next(err);
        }
        if (!employee) {
            return res.status(400).send({ error: "Cant get feedbacks of non-existing employee" });
        }
        var requiringFeedbacks = employee.requiringFeedbacks,
            submittedFeedbacks = employee.submittedFeedbacks;

        return res.json({ requiringFeedbacks: requiringFeedbacks, submittedFeedbacks: submittedFeedbacks });
    });
};

exports.saveFeedback = function (req, res, next) {
    var feedbackId = req.params.feedbackId;
    _feedback2.default.findById(feedbackId, function (err, feedback) {
        if (err) {
            return next(err);
        }
        if (!feedback) {
            return res.status(400).send({ error: "Cant save non-existing feedback" });
        }
        // insert new contents to the feedback
        for (var key in req.body) {
            feedback[key] = req.body[key];
        }
        feedback.save(function (err) {
            if (err) {
                return next(err);
            }
        });
        return res.json({ feedback: feedback });
    });
};

exports.submitFeedback = function (req, res, next) {
    var employeeId = req.params.employeeId;
    var feedbackId = req.params.feedbackId;
    _feedback2.default.findById(feedbackId, function (err, feedback) {
        if (err) {
            return next(err);
        }
        if (!feedback) {
            return res.status(400).send({ error: "Cant save non-existing feedback" });
        }
        // insert new contents to the feedback
        for (var key in req.body) {
            feedback[key] = req.body[key];
        }
        feedback.submitted = true;
        feedback.save(function (err) {
            if (err) {
                return next(err);
            }
            _employee2.default.findById(employeeId, function (err, employee) {
                if (err) {
                    return next(err);
                }
                if (!employee) {
                    return res.status(400).send({ error: "Can't changed requiring feedbacks to submitted feedbacks of non-existing employee" });
                }
                var index = employee.requiringFeedbacks.indexOf(feedbackId);
                if (index !== -1) {
                    employee.requiringFeedbacks.splice(index, 1);
                }
                employee.submittedFeedbacks.push(feedbackId);
                employee.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                });
                return res.json({ feedback: feedback });
            });
        });
    });
};
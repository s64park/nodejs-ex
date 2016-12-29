'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * Created by Terry on 2016-12-14.
                                                                                                                                                                                                                                                                   */


var _employee = require('../models/employee');

var _employee2 = _interopRequireDefault(_employee);

var _admin = require('../models/admin');

var _admin2 = _interopRequireDefault(_admin);

var _performance = require('../models/performance');

var _performance2 = _interopRequireDefault(_performance);

var _feedback = require('../models/feedback');

var _feedback2 = _interopRequireDefault(_feedback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var sampleAdmin = {
    username: "admin",
    password: "password",
    firstname: "Danny",
    lastname: "Park",
    email: "admin@gmail.com",
    title: "CEO",
    department: "BOD"
};
// This is for convenience, since admin account can't be created through user site.
exports.createAdmin = function (req, res, next) {
    _admin2.default.findOne({ username: sampleAdmin.username }, function (err, admin) {
        if (err) {
            return next(err);
        }
        if (!admin) {
            var newAdmin = new _admin2.default(_extends({}, sampleAdmin));
            newAdmin.password = newAdmin.generateHash(sampleAdmin.password);
            newAdmin.save(function (err) {
                if (err) {
                    return next(err);
                }
            });
            res.json({ admin: newAdmin });
        }
    });
};

// Consider of changing after UI is built
exports.getEmployees = function (req, res, next) {
    _employee2.default.find({}, function (err, employees) {
        if (err) {
            next(err);
        }
        return res.json({ employees: employees });
    });
};

// Add employee --- Only admin can add employee
exports.addEmployee = function (req, res, next) {
    var _req$body = req.body,
        username = _req$body.username,
        password = _req$body.password,
        firstname = _req$body.firstname,
        lastname = _req$body.lastname,
        email = _req$body.email,
        title = _req$body.title,
        department = _req$body.department,
        contact = _req$body.contact,
        address = _req$body.address;

    _employee2.default.findOne({ username: username }, function (err, employee) {
        if (err) {
            return next(err);
        }
        if (employee) {
            return res.status(400).send({ error: "the employee is already registered" });
        }
        var newEmployee = new _employee2.default({
            username: username, firstname: firstname, lastname: lastname, email: email, title: title, department: department, contact: contact, address: address
        });
        newEmployee.password = newEmployee.generateHash(password);
        // password should be encrypted
        newEmployee.save(function (err) {
            if (err) {
                return next(err);
            }
            // After the authentication part is done, we can get admin data from req.admin
            // temporaliy use header.adminId
            res.json({ employee: newEmployee }); //send admin information
        });
    });
};

exports.getEmployee = function (req, res, next) {
    var employeeId = req.params.employeeId;
    _employee2.default.findById(employeeId, function (err, employee) {
        if (err) {
            next(err);
        }
        if (!employee) {
            return res.status(400).send({ error: "The employee is not registered" });
        }
        return res.json({ employee: employee });
    });
};

exports.updateEmployee = function (req, res, next) {
    var employeeId = req.params.employeeId;
    _employee2.default.findById(employeeId, function (err, employee) {
        if (err) {
            next(err);
        }
        if (!employee) {
            return res.status(400).send({ error: "The employee is not registered" });
        }
        for (var key in req.body) {
            employee[key] = req.body[key];
        }
        employee.save(function (err) {
            if (err) return next(err);
        });
        return res.json({ employee: employee });
    });
};

exports.deleteEmployee = function (req, res, next) {
    var employeeId = req.params.employeeId;
    _employee2.default.findByIdAndRemove(employeeId, function (err, resp) {
        if (err) {
            return next(err);
        }
        _performance2.default.findOne({ employeeId: employeeId }, function (err, performance) {
            if (err) {
                return next(err);
            }
            if (performance) {
                // Remove related feedbacks
                _feedback2.default.find({ '_id': { $in: [].concat(_toConsumableArray(performance.feedbacks)) } }).remove(function (err) {
                    if (err) {
                        return next(err);
                    }
                });
                // Remove the user's performance
                performance.remove(function (err) {
                    if (err) {
                        return next(err);
                    }
                });
            }
        });
        return res.json({ resp: resp });
    });
};

exports.getPerformanceReview = function (req, res, next) {
    var employeeId = req.params.employeeId;
    _performance2.default.findOne({ employeeId: employeeId }, function (err, performance) {
        if (err) {
            return next(err);
        }
        if (!performance) {
            var newPerformance = new _performance2.default({
                employeeId: employeeId
            });

            newPerformance.save(function (err) {
                if (err) return next(err);
            });
            return res.json({ performance: newPerformance });
        } else {
            return res.json({ performance: performance });
        }
    });
};

exports.addPerformanceReview = function (req, res, next) {
    var employeeId = req.params.employeeId;
    _performance2.default.findOne({ employeeId: employeeId }, function (err, performanceReview) {
        if (err) {
            return next(err);
        }
        if (performanceReview) {
            return res.status(400).send({ error: "The employee has already been created the performance review" });
        }
        var newPerformanceReview = new _performance2.default({ employeeId: employeeId });
        for (var key in req.body) {
            newPerformanceReview[key] = req.body[key];
        }
        newPerformanceReview.save(function (err) {
            if (err) {
                return next(err);
            }
        });
        res.json({ performanceReview: newPerformanceReview });
    });
};

exports.updatePerformanceReview = function (req, res, next) {
    var employeeId = req.params.employeeId;
    _performance2.default.findOne({ employeeId: employeeId }, function (err, performance) {
        if (err) {
            return next(err);
        }
        if (!performance) {
            return res.status(400).send({ error: "Does not have the performance review, add it first" });
        }
        for (var key in req.body) {
            performance[key] = req.body[key];
        }
        performance.updatedAt = new Date();
        performance.save(function (err) {
            if (err) {
                return next(err);
            }
        });
        res.json({ performance: performance });
    });
};

exports.getFeedbacks = function (req, res, next) {
    var employeeId = req.params.employeeId;
    var assignedEmployee = [];

    _performance2.default.findOne({ employeeId: employeeId }).populate('feedbacks').exec(function (err, performance) {
        if (err) {
            return next(err);
        }
        if (!performance) {
            return res.json({ error: "Can't have feedbacks of non-existing performance" });
        }
        for (var i = 0; i < performance.feedbacks.length; i++) {
            assignedEmployee.push(performance.feedbacks[i].reviewer._id);
        }
        _employee2.default.find({ _id: { $nin: assignedEmployee } }, function (err, employees) {
            if (err) {
                return next(err);
            }
            res.json({ assignedFeedbacks: performance.feedbacks, unassignedEmployees: employees });
        });
    });
};

exports.assignFeedback = function (req, res, next) {
    var employeeId = req.params.employeeId;
    var assignedEmployeeId = req.params.assignedEmployeeId;
    var _req$body2 = req.body,
        reviewerName = _req$body2.reviewerName,
        reviewerTitle = _req$body2.reviewerTitle,
        reviewerDepartment = _req$body2.reviewerDepartment,
        revieweeName = _req$body2.revieweeName,
        revieweeTitle = _req$body2.revieweeTitle,
        revieweeDepartment = _req$body2.revieweeDepartment;

    _feedback2.default.findOne({ 'reviewer._id': assignedEmployeeId, 'reviewee._id': employeeId }, function (err, feedback) {
        if (err) {
            return next(err);
        }
        if (feedback) {
            return res.status(400).send({ error: "Feedback has already been created" });
        }
        var newFeedback = new _feedback2.default({
            reviewer: {
                _id: assignedEmployeeId,
                name: reviewerName,
                title: reviewerTitle,
                department: reviewerDepartment
            },
            reviewee: {
                _id: employeeId,
                name: revieweeName,
                title: revieweeTitle,
                department: revieweeDepartment
            }
        });
        newFeedback.save(function (err) {
            if (err) {
                return next(err);
            }

            _performance2.default.findOne({ employeeId: employeeId }, function (err, performance) {
                if (err) {
                    return next(err);
                }
                if (!performance) {
                    return res.status(400).send({ error: "Performance must be created before assigning feedbacks" });
                }

                if (performance.feedbacks.indexOf(newFeedback._id) === -1) {
                    performance.feedbacks.push(newFeedback._id);
                }
                performance.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                });
                _employee2.default.findById(assignedEmployeeId, function (err, employee) {
                    if (err) {
                        return next(err);
                    }
                    employee.requiringFeedbacks.push(newFeedback._id);
                    employee.save(function (err) {
                        return next(err);
                    });
                });
                return res.json({ assignedFeedback: newFeedback });
            });
        });
    });
};

exports.unassignFeedback = function (req, res, next) {
    var employeeId = req.params.employeeId;
    var assignedEmployeeId = req.params.assignedEmployeeId;
    _feedback2.default.findOne({ 'reviewer._id': assignedEmployeeId, 'reviewee._id': employeeId }, function (err, feedback) {
        if (err) {
            return next(err);
        }
        if (!feedback) {
            return res.status(400).send({ error: "Can't unassign feedback that does not exist" });
        }
        _performance2.default.findOne({ employeeId: employeeId }, function (err, performance) {
            if (err) {
                return next(err);
            }
            if (!performance) {
                return res.status(400).send({ error: "Performance must be created before unassigning feedbacks" });
            }

            var index = performance.feedbacks.indexOf(feedback._id);
            if (index !== -1) {
                performance.feedbacks.splice(index, 1);
            }
            performance.save(function (err) {
                if (err) {
                    return next(err);
                }
            });
            _employee2.default.findById(assignedEmployeeId, function (err, employee) {
                if (err) {
                    return next(err);
                }
                var requiringIndex = employee.requiringFeedbacks.indexOf(feedback._id);
                var submittedIndex = employee.submittedFeedbacks.indexOf(feedback._id);
                if (requiringIndex !== -1) {
                    employee.requiringFeedbacks.splice(requiringIndex, 1);
                } else if (submittedIndex !== -1) {
                    employee.submittedFeedbacks.splice(submittedIndex, 1);
                }
                employee.save(function (err) {
                    return next(err);
                });
                feedback.remove(function (err) {
                    if (err) {
                        return next(err);
                    }
                });
                return res.json({ unassignedEmployee: employee });
            });
        });
    });
};
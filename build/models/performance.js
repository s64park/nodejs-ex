'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
/*
    summary of Performance:             Performance Deifinition:
    O   Outstanding                     Performance is superior on a consistent and sustained basis
    E   Exceeds Expectation             Performance exceeds normal job requirements
    M   Meets Expectations              Performance meets position requirements
    NI  Needs Improvement               Performance meets some position requirements, objectives and expectations
    U   Unsatisfactory                  Performance does not meet position requirements, objectives, and expectations.
                                        Immediate attention to improvement is required
    NA  Not Applicable                  Criterion does not apply to this position
 */

/**
 * Created by Terry on 2016-12-14.
 */
var performanceSchema = new Schema({
    employeeId: _mongoose2.default.Schema.Types.ObjectId,
    qualityOfWork: String, //"O", "E", "M", "NI", "U", "NA"
    quantityOfWork: String, //"O", "E", "M", "NI", "U", "NA"
    individualEffectiveness: String,
    communication: String,
    serviceFocus: String,
    judgementAndDecisionMaking: String,
    teamBuilding: String,
    initiative: String,
    ongoingSkillsImprovement: String,
    dependability: String,
    safeWorkPractice: String,
    attendanceAndPuntuality: String,
    overall: String, // BE, ME, US
    employerComments: String,
    submitted: { type: Boolean, default: false },
    feedbacks: { type: [{ type: [_mongoose2.default.Schema.Types.ObjectId], ref: 'feedback' }], default: [] }

}, {
    timestamps: true
});

exports.default = _mongoose2.default.model('performanceReview', performanceSchema);
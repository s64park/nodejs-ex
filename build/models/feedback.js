'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
// Define our model

/**
 * Created by Terry on 2016-12-17.
 */
var feedbackSchema = new Schema({
    name: String,
    title: String,
    department: String,
    overall: {
        type: String },
    comments: {
        type: String
    },
    reviewer: {
        _id: { type: _mongoose2.default.Schema.Types.ObjectId, ref: 'employee' },
        name: String,
        title: String,
        department: String
    },
    reviewee: {
        _id: { type: _mongoose2.default.Schema.Types.ObjectId, ref: 'employee' },
        name: String,
        title: String,
        department: String
    },
    submitted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

exports.default = _mongoose2.default.model('feedback', feedbackSchema);
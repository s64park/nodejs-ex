'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Terry on 2016-11-28.
 */
var Schema = _mongoose2.default.Schema;
// Define our model
var employeeSchema = new Schema({
    username: String, // when login for confidential company information or by oneself
    password: String, // when login for confidential company information or by oneself
    firstname: String,
    lastname: String,
    email: { type: String, lowercase: true },
    title: String,
    department: String,
    contact: String,
    address: String,
    requiringFeedbacks: { type: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'feedback' }], default: [] },
    submittedFeedbacks: { type: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'feedback' }], default: [] }
}, {
    timestamps: true
});

// On Save Hook, encrypt password
// Before saving a model, run this function

// generates hash
employeeSchema.methods.generateHash = function (password) {
    return _bcryptjs2.default.hashSync(password, 8);
};

// compares the password
employeeSchema.methods.validateHash = function (password) {
    return _bcryptjs2.default.compareSync(password, this.password);
};

// Create the model class
exports.default = _mongoose2.default.model('employee', employeeSchema);
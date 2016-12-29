'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by Terry on 2016-12-20.
 */
var express = require('express');
var Authentication = require('../controllers/authentication');
var Admin = require('../controllers/admin');
var router = express.Router();

// this is just for convenience
router.route('/createAdmin').post(Admin.createAdmin);

router.route('/signin').post(Authentication.signin);

exports.default = router;
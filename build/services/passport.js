'use strict';

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

/*
    This can be used for 3rd party OAuth authentication
    However, I created local authentication middleware by myself.
    This is so far just a piece of code for future implementation
 */

// Setup options for JWT Strategy
var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: _config2.default.secret
};

// Create JWT strategy, payload is decoded JWT token
var jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    // See if the user ID in the payload exists in our database
    // If it does, call 'done' with that other
    // otherwise, call done without a user object
    User.findById(payload.sub, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

var facebookOptions = {
    clientID: _config2.default.facebookAuth.clientID,
    clientSecret: _config2.default.facebookAuth.clientSecret,
    callbackURL: _config2.default.facebookAuth.callbackURL,
    profileFields: ['emails', 'displayName']
};

var facebookLogin = new FacebookStrategy(facebookOptions, function (token, refreshToken, profile, done) {
    User.findOne({ 'facebook.id': profile.id }, function (err, user) {
        if (err) return done(err);
        if (!user) {
            var newUser = new User({
                facebook: {
                    id: profile.id,
                    token: token,
                    name: profile.displayName,
                    email: profile.emails[0].value
                }
            });
            //save our user to the database
            newUser.save(function (err) {
                if (err) done(err);
                return done(null, newUser);
            });
        }
        if (user) {
            // if there is a user id already but no token (user was linked at one point and then removed)
            // just add our token and profile information
            if (!user.facebook.token) {
                user.facebook.token = token;
                user.facebook.name = profile.displayName;
                user.facebook.email = profile.emails[0].value;

                user.save(function (err) {
                    if (err) done(err);
                    return done(null, user);
                });
            }
            return done(null, user);
        }
    });
});

// Tell passport to user this strategy
_passport2.default.use(jwtLogin);
_passport2.default.use(localLogin);
_passport2.default.use(facebookLogin);
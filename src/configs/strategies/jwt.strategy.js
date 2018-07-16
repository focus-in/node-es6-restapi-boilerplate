// const _ = require('lodash');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const UserModel = require('../../modules/user/models/user.model');

const { ExtractJwt } = passportJWT;
const JwtStrategy = passportJWT.Strategy;
// const UserModel = require('mongoose').model('User');
const { auth } = require('../env');

module.exports.init = () => {
  // Use local strategy
  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, next) => {
    UserModel.findOne({ email })
      .then((user) => {
        // check user password is valid
        if (!user || !user.comparePassword(password)) {
          return next(new Error('Invalid username or password'), false);
        }
        if (user.activeFlag !== true) {
          // HACK: return the activation url for dev environment
          let tokenUrl;
          if (process.env.NODE_ENV === 'development') {
            tokenUrl = `http://localhost:3000/api/v1/auth/activate/${user.activate.token}`;
          }
          return next(new Error(`User not active, please check your registered email to activate @dev hack url ${tokenUrl}`), false);
        }
        if (user.deleteFlag) {
          return next(new Error('Cannot login, please contact admin for more details'), false);
        }
        return next(null, user);
      }, (err) => {
        next(err);
      });
  }));
};

module.exports.get = () => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeader();
  options.secretOrKey = auth.secret;
  // options.issuer = "accounts.matkraft.com";
  // options.audience = "matkraft.com";

  passport.use('auth-jwt', new JwtStrategy(options, (payload, done) => {
    UserModel.findById(payload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      }, (err) => {
        done(err, false);
      });
  }));
};

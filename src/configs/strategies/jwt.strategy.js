// const _ = require('lodash');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const JwtStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const UserModel = require('mongoose').model('User');

module.exports.load = () => {
  // Use local strategy
  passport.use('authJwt', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, done) => {
    UserModel.findOne({ email, password })
      .then((user) => {
        // check user password is valid
        // if (!user || !user.authenticate(password)) {
        //   return done(new Error('Invalid username or password'), false);
        // }
        // check user is active
        if (user.activeFlag !== true) {
          let tokenUrl;
          if (process.env.NODE_ENV === 'development') {
            tokenUrl = `Dev activate url http://localhost:5000/api/v1/auth/activate/${user.activateToken}`;
          }
          return done(new Error(`User not active, please check your registered email to activate ${tokenUrl}`), false);
        }
        if (user.deleteFlag) {
          return done(new Error('Cannot login, please contact admin for more details'), false);
        }
        return done(null, user);
      }, (err) => {
        done(err);
      });
  }));
};

module.exports.get = (config) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeader();
  options.secretOrKey = config.jwtSuperSecret || 'amQ,5z)9E24_)qG[FK,UkD*p@123';
  // options.issuer = "accounts.matkraft.com";
  // options.audience = "matkraft.com";

  passport.use('authJwt', new JwtStrategy(options, (payload, done) => {
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

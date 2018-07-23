const passportJWT = require('passport-jwt');
const UserModel = require('../../modules/user/models/user.model');

const { ExtractJwt } = passportJWT;
const JwtStrategy = passportJWT.Strategy;
// const UserModel = require('mongoose').model('User');
const { auth } = require('../env');

module.exports = (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = auth.secret;
  // options.issuer = "accounts.matkraft.com";
  // options.audience = "matkraft.com";

  passport.use('jwt', new JwtStrategy(options, (payload, done) => {
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

const passportJWT = require('passport-jwt');
require('module-alias/register');
const { model: UserModel } = require('@modules/user'); // eslint-disable-line

const { ExtractJwt } = passportJWT;
const JwtStrategy = passportJWT.Strategy;
const { auth } = require('../env');

module.exports = (passport) => {
  const options = {};
  // options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
  options.secretOrKey = auth.secret;
  // options.issuer = "accounts.matkraft.com";
  // options.audience = "matkraft.com";

  passport.use('jwt', new JwtStrategy(options, (payload, done) => {
    UserModel.findById(payload._id)
      .then((user) => {
        if (user) {
          return done(false, user);
        }
        return done(false, null);
      }, (err) => {
        done(err, null);
      });
  }));
};

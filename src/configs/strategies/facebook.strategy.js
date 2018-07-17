const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const { facebook } = require('../env').auth;
const UserModel = require('../../modules/user/models/user.model');

module.exports.init = () => {
  passport.use('facebook', new FacebookStrategy(facebook, (accessToken, refreshToken, profile, cb) => {
    UserModel.findOrCreate({ facebookId: profile.id })
      .then((err, user) => {
        cb(err, user);
      });
  }));
};

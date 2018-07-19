const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const { google } = require('../env').auth;
const UserModel = require('../../modules/user/models/user.model');

module.exports.init = () => {
  passport.use('google', new GoogleStrategy(google, (accessToken, refreshToken, profile, cb) => {
    console.log('---google strategy-----');
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    cb(null, profile);
    // UserModel.findOrCreate({ googleId: profile.id })
    //   .then((err, user) => {
    //     console.log('---google strategy-----');
    //     console.log(accessToken);
    //     console.log(refreshToken);
    //     console.log(profile);
    //     cb(err, user);
    //   });
  }));
};


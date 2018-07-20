const FacebookStrategy = require('passport-facebook').Strategy;

const { facebook } = require('../env').auth;
// const UserModel = require('../../modules/user/models/user.model');

module.exports.init = (passport) => {
  passport.use('facebook', new FacebookStrategy(facebook, (accessToken, refreshToken, profile, cb) => {
    // console.log('---google strategy-----');
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile);
    cb(null, profile);
    // UserModel.findOrCreate({ facebookId: profile.id })
    //   .then((err, user) => {
    //     cb(err, user);
    //   });
  }));
};

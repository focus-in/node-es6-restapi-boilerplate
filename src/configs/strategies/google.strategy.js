const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { google } = require('../env').auth;

const UserModel = require('../../modules/user/models/user.model');

module.exports = () => {
  passport.use('google', new GoogleStrategy(google, (accessToken, refreshToken, profile, cb) => {
    if (profile) {
      const user = {};
      user.firstName = profile.name.givenName;
      user.lastName = profile.name.familyName;
      user.email = profile.email;
      user.gender = profile.gender;
      user.photos = profile.photos;
      user.image = profile.image;
      user.service = {};
      user.service.provider = profile.provider;
      user.service.id = profile.id;
      user.service._raw = JSON.parse(profile._raw);
      user.activeFlag = true;

      const User = new UserModel(user);
      User.save();
    }

    console.log('--------_GOOGLE-OAUTH----------');
    console.log(profile);
    console.log(accessToken);
    console.log(refreshToken);
    console.log('------------GOOGLE-oAUTH-----------');
    cb(false, null);
    // UserModel.findOrCreate({ googleId: profile.id })
    //   .then((err, user) => {
    //     cb(err, user);
    //   });
  }));
};


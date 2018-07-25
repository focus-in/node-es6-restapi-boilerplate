const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { google } = require('../env').auth;

const UserModel = require('../../modules/user/models/user.model');

module.exports = () => {
  passport.use('google', new GoogleStrategy(google, async (accessToken, refreshToken, profile, next) => {
    try {
      console.log('--------_GOOGLE-OAUTH----------');
      console.log(profile.photos[0]);
      console.log(typeof profile.photos[0]);
      console.log(profile._raw);
      console.log(accessToken);
      console.log(refreshToken);
      console.log('------------GOOGLE-oAUTH-----------');

      // check current user exist in db
      const existingUser = await UserModel.findOne({ 'service.id': profile.id });
      if (existingUser) {
        return next(null, existingUser);
      }

      // create new user
      const newUser = new UserModel({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.email,
        gender: profile.gender,
        // photos: profile.photos,
        image: {
          url: profile.image,
          isDefault: true,
        },
        service: {
          provider: profile.provider,
          id: profile.id,
          accessToken,
          _raw: profile._raw,
        },
        activeFlag: true,
      });
      await newUser.save();
      return next(null, newUser);
    } catch (e) {
      return next(e, false);
    }
  }));
};


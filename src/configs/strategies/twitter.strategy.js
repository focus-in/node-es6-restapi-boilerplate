const _ = require('lodash');
const TwitterStrategy = require('passport-twitter').Strategy;
const { twitter } = require('../env').auth;
require('module-alias/register');
const UserModel = require('@modules/user').model; // eslint-disable-line


module.exports = (passport) => {
  passport.use('twitter', new TwitterStrategy(twitter, async (req, token, tokenSecret, profile, next) => {
    try {
      // check current user exist in db
      const existingUser = await UserModel.findOne({ email: profile.emails[0].value });
      if (existingUser) {
        // check the google provider
        if (
          _.filter(existingUser.services, _.matches({
            id: profile.id, provider: profile.provider,
          })).length === 0
        ) {
          // push the new provider to user oauth services
          const serviceProfile = _.pick(profile, ['id', 'provider', '_raw']);
          serviceProfile.accessToken = token;
          existingUser.services.push(serviceProfile);
          await existingUser.save();
        }
        return next(null, existingUser);
      }

      // create new user
      const newUser = new UserModel({
        firstName: profile.displayName,
        email: profile.emails[0].value,
        // photos: profile.photos, // TODO: photos not going through
        services: [{
          provider: profile.provider,
          id: profile.id,
          accessToken: token,
          _raw: profile._raw,
        }],
        activeFlag: true,
      });
      await newUser.save();
      return next(null, newUser);
    } catch (e) {
      return next(e, false);
    }
  }));
};


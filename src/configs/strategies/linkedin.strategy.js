const _ = require('lodash');
const LinkedInStrategy = require('passport-linkedin').Strategy;
const { linkedin } = require('../env').auth;
require('module-alias/register');
const UserModel = require('@modules/user').model; // eslint-disable-line

module.exports = (passport) => {
  passport.use('linkedin', new LinkedInStrategy(linkedin, async (accessToken, refreshToken, profile, next) => {
    try {
      // check current user exist in db
      const existingUser = await UserModel.findOne({ email: profile._json.emailAddress });
      if (existingUser) {
        // check the linkedin provider
        if (
          _.filter(existingUser.services, _.matches({
            id: profile.id, provider: profile.provider,
          })).length === 0
        ) {
          // push the new provider to user oauth services
          const serviceProfile = _.pick(profile, ['id', 'provider', '_raw']);
          serviceProfile.accessToken = accessToken;
          existingUser.services.push(serviceProfile);
          await existingUser.save();
        }
        return next(null, existingUser);
      }

      // create new user
      const newUser = new UserModel({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile._json.emailAddress,
        bio: profile._json.headline,
        services: [{
          provider: profile.provider,
          id: profile.id,
          accessToken,
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

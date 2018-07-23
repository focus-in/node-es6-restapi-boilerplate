const TwitterStrategy = require('passport-twitter').Strategy;

const { twitter } = require('../env').auth;
const UserModel = require('../../modules/user/models/user.model');

module.exports = (passport) => {
  passport.use('twitter', new TwitterStrategy(twitter, (token, tokenSecret, profile, cb) => {
    UserModel.findOrCreate({ twitterId: profile.id })
      .then((err, user) => {
        cb(err, user);
      });
  }));
};


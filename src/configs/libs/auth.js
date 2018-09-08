require('module-alias/register');
const UserModel = require('@modules/user').model; // eslint-disable-line

module.exports.init = (passport) => {
  // Serialize auth user
  passport.serializeUser((user, next) => {
    next(null, user._id);
  });

  // Deserialize auth user
  passport.deserializeUser((id, next) => {
    UserModel.findOne({
      _id: id,
    }, '-salt -password', (err, user) => {
      next(err, user);
    });
  });
};

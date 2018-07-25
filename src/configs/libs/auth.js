const UserModel = require('@modules/user'); // eslint-disable-line

module.exports.init = (passport) => {
  // Serialize auth user
  passport.serializeUser((user, next) => {
    console.log('user auth token');
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

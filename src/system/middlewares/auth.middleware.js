const passport = require('passport');

/**
 * Select fields builder for list request
 *
 * @param {object} query request query object for select fields
 * @param {array} secureFields secure fields of object should not pass in list
 * @return {object} query with select fields string
 */
exports.isLoggedIn = () => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      err.status = 401;
      return next(err);
    }
    if (!user) {
      err = new Error('Invalid authorization');
      err.status = 401;
      return next(err);
    }
    req.user = user;
    return next();
  })(req, res, next);
};

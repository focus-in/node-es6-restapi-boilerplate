const passport = require('passport');

/**
 * Check jwt token to validate user authorization
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 */
exports.isLoggedIn = () => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      err.status = 401;
      return next(err);
    }
    if (!user) {
      err = new Error('Invalid authorization');
      err.status = 403;
      return next(err);
    }
    req.user = user;
    return next();
  })(req, res, next);
};

/**
 * Check jwt token to validate user is admin
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 */
exports.isAdmin = () => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      err.status = 401;
      return next(err);
    }
    if (!user || user.role !== 'admin') {
      err = new Error('Invalid access!');
      err.status = 403;
      return next(err);
    }
    req.user = user;
    return next();
  })(req, res, next);
};

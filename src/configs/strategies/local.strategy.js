const LocalStrategy = require('passport-local').Strategy;
require('module-alias/register');
const { model: UserModel } = require('@modules/user'); // eslint-disable-line

module.exports = (passport) => {
  // Use local strategy
  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, next) => {
    UserModel.findOne({ email })
      .then((user) => {
        // check user password is valid
        if (!user || !user.comparePassword(password)) {
          return next(new Error('Invalid username or password'), false);
        }
        let err; // define error variable
        if (user.activeFlag !== true) {
          // HACK: return the activation url for dev environment
          let devHint = '';
          if (process.env.NODE_ENV === 'development') {
            devHint = ` @dev hint url http://localhost:3000/api/v1/auth/activate/${user.activate.token}`;
          }
          err = new Error(`User not active, please check your registered email to activate${devHint}`);
          err.status = 401; // UNAUTHORIZED
          return next(err, false);
        }
        if (user.deleted) {
          err = new Error('Cannot login, please contact admin for more details');
          err.status = 403; // FORBIDDEN
          return next(err, false);
        }
        return next(null, user);
      }, (err) => {
        next(err);
      });
  }));
};

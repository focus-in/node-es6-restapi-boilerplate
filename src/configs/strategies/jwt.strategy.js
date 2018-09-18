const passportJWT = require('passport-jwt');
require('module-alias/register');
const { model: UserModel } = require('@modules/user'); // eslint-disable-line
const { model: AuthModel } = require('@modules/auth'); // eslint-disable-line

const { Strategy: JwtStrategy } = passportJWT;
const { auth } = require('../env');

module.exports = (passport) => {
  const options = {};
  let token = null;
  // options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  // options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
  options.secretOrKey = auth.secret;
  options.jwtFromRequest = (req) => {
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ');
      if (authorization[0] === 'JWT') {
        token = authorization[1];
      }
    }
    return token;
  };

  passport.use('jwt', new JwtStrategy(options, async (payload, done) => {
    try {
      const authObj = await AuthModel.findOne({
        _userId: payload._id,
        token,
        isActive: true,
      });
      if (!authObj) {
        throw new Error('Invalid/Expired token, please login again');
      }
      // check the expiry date of auth object
      if (authObj.expires < new Date()) {
        authObj.isActive = false;
        await authObj.save();
        throw new Error('Token expired, please login again');
      }
      // get the user details
      const user = await UserModel.findById(payload._id);
      if (!user) {
        throw new Error('Invalid user');
      }
      return done(false, user);
    } catch (err) {
      return done(err, null);
    }
  }));
};

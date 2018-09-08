const passport = require('passport');
const controller = require('../controllers/auth.controller');
const validator = require('../validators/auth.validator');

module.exports = (router, validate) => {
  router.route('/auth/signup')
    /**
     * @api {post} /auth/signup Signup user
     * @apiDescription Register user with direct email address
     * @apiVersion 0.0.1
     * @apiName EmailSignup
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiParam  {String}          firstName   User's first name
     * @apiParam  {String}          lastName    User's last name
     * @apiParam  {String}          email       User's email
     * @apiParam  {String{6..128}}  password    User's password
     * @apiParam  {Number{0-9}}     phone       User's phone
     *
     * @apiSuccess (Created 201) {ID}      id                  User's id
     * @apiSuccess (Created 201) {String}  firstName           User's first name
     * @apiSuccess (Created 201) {String}  lastName            User's last name
     * @apiSuccess (Created 201) {String}  email               User's email
     * @apiSuccess (Created 201) {Number}  phone               User's phone
     * @apiSuccess (Created 201) {String}  activate.token      User activation token
     * @apiSuccess (Created 201) {String}  activate.expireAt   User activation token expiry time
     * @apiSuccess (Created 201) {Date}    createdAt           User created timestamp
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .post(validate(validator.signup), controller.signup);

  router.route('/auth/signin')
    /**
     * @api {post} /auth/signin Signin User
     * @apiDescription User login with direct email address
     * @apiVersion 0.0.1
     * @apiName EmailSignin
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiParam  {String}          email       User's email
     * @apiParam  {String{6..128}}  password    User's password
     *
     * @apiSuccess (Ok 200) {ID}      id                  User's id
     * @apiSuccess (Ok 200) {String}  firstName           User's first name
     * @apiSuccess (Ok 200) {String}  lastName            User's last name
     * @apiSuccess (Ok 200) {String}  email               User's email
     * @apiSuccess (Ok 200) {Number}  phone               User's phone
     * @apiSuccess (Ok 200) {String}  activate.token      User activation token
     * @apiSuccess (Ok 200) {String}  activate.expireAt   User activation token expiry time
     * @apiSuccess (Ok 200) {Date}    createdAt           User created timestamp
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
     * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
     */
    .post(validate(validator.signin), controller.signin);

  router.route('/auth/activate/:token')
    /**
     * @api {get} /auth/activate/:token Activate user registration
     * @apiDescription Activate user with token sent in email or phone
     * @apiVersion 0.0.1
     * @apiName ActivateUser
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiParam  {String}  token         User's activate token
     *
     * @apiSuccess {String}  message     User activated successfully
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
     */
    .get(validate(validator.activate), controller.activate);

  router.route('/auth/reactivate')
    /**
     * @api {post} /auth/reactivate Resend activation token to registered user
     * @apiDescription Resend activation token to registered user in email or phone
     * @apiVersion 0.0.1
     * @apiName ReActivateUser
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiParam   {String}  email      User's email
     *
     * @apiSuccess {String}  message    Activation token sent to registered email address
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
     */
    .post(validate(validator.reactivate), controller.reactivate);

  router.route('/auth/refresh')
    /**
     * @api {post} /auth/refresh Refresh Auth Token
     * @apiDescription Refresh expired accessToken
     * @apiVersion 0.0.1
     * @apiName RefreshToken
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiParam  {String}  token         User's access token
     * @apiParam  {String}  refreshToken  Refresh token to reset access token
     *
     * @apiSuccess {String}  tokenType     Access Token's type
     * @apiSuccess {String}  accessToken   Authorization Token
     * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
     * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
     */
    .post(validate(validator.refresh), controller.refresh);

  router.route('/auth/forgot')
    /**
     * @api {post} /auth/forgot Forgot password
     * @apiDescription Forgot password request to generate reset token to update user password
     * @apiVersion 0.0.1
     * @apiName ForgotPassword
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiParam  {String}    email     User's email address
     *
     * @apiSuccess {String}   message   Reset token sent to registered email
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Incorrect email
     */
    .post(validate(validator.forgot), controller.forgot);

  router.route('/auth/reset')
    /**
     * @api {post} /auth/reset/:token Reset user forgot Password
     * @apiDescription Reset user password with new password
     * @apiVersion 0.0.1
     * @apiName ResetPassword
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiParam  {String}  token      User's reset password token
     * @apiParam  {String}  password    New Password
     *
     * @apiSuccess {String}  message      Password reset success message
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Incorrect resetToken
     */
    .post(validate(validator.reset), controller.reset);

  router.route('/auth/google')
    /**
     * @api {post} /auth/google Google oAuth login
     * @apiDescription Login with your google credentials works direct url in browser
     * @apiVersion 0.0.1
     * @apiName GoogleOauth
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiSuccess {String}  html User oauth signin success page
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Incorrect resetToken
     */
    .get(passport.authenticate('google', { scope: ['email'] }));

  router.route('/auth/google/callback')
    .get(passport.authenticate('google'), controller.oauth);

  router.route('/auth/facebook')
    /**
     * @api {post} /auth/facebook Facebook oAuth login
     * @apiDescription Login with your facebook credentials works direct url in browser
     * @apiVersion 0.0.1
     * @apiName FacebookOauth
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiSuccess {String}  html User oauth signin success page
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Incorrect resetToken
     */
    .get(passport.authenticate('facebook', { scope: 'email' }));

  router.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook'), controller.oauth);

  router.route('/auth/twitter')
    /**
     * @api {post} /auth/twitter Twitter oAuth login
     * @apiDescription Login with your twitter credentials works direct url in browser
     * @apiVersion 0.0.1
     * @apiName TwitterOauth
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiSuccess {String}  html User oauth signin success page
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Incorrect resetToken
     */
    .get(passport.authenticate('twitter', { session: false }));

  router.route('/auth/twitter/callback')
    .get(passport.authenticate('twitter'), controller.oauth);

  router.route('/auth/linkedin')
    /**
     * @api {post} /auth/linkedin Google oAuth login
     * @apiDescription Login with your linkedin credentials works direct url in browser
     * @apiVersion 0.0.1
     * @apiName GoogleOauth
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiSuccess {String}  html User oauth signin success page
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Incorrect resetToken
     */
    // r_fullprofile r_emailaddress r_contactinfo
    .get(passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));

  router.route('/auth/linkedin/callback')
    .get(passport.authenticate('linkedin'), controller.oauth);

  return router;
};

const passport = require('passport');
const validate = require('express-validation');
const AuthController = require('../controllers/auth.controller');
const AuthValidator = require('../validators/auth.validator');

module.exports = (router) => {
  router.route('/auth/signup')
    /**
     * @api {post} /signup Signup user
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
    .post(validate(AuthValidator.signup), AuthController.signup);

  router.route('/auth/signin')
    /**
     * @api {post} /signin Signin User
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
    .post(validate(AuthValidator.signin), AuthController.signin);

  router.route('/auth/activate/:token')
    /**
     * @api {get} /activate/:token Activate user registration
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
    .get(validate(AuthValidator.activate), AuthController.activate);

  router.route('/auth/reactivate')
    /**
     * @api {post} /reactivate Resend activation token to registered user
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
    .post(validate(AuthValidator.reactivate), AuthController.reactivate);

  router.route('/auth/refresh')
    /**
     * @api {post} /refresh Refresh Auth Token
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
    .post(validate(AuthValidator.refresh), AuthController.refresh);

  router.route('/auth/forgot')
    /**
     * @api {post} /forgot Forgot password
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
    .post(validate(AuthValidator.forgot), AuthController.forgot);

  router.route('/auth/reset/:token')
    /**
     * @api {post} /reset/:token Reset user forgot Password
     * @apiDescription Reset user password with new password
     * @apiVersion 0.0.1
     * @apiName ResetPassword
     * @apiGroup Auth
     * @apiPermission public
     *
     * @apiParam  {String}  :token      User's reset password token
     * @apiParam  {String}  password    New Password
     *
     * @apiSuccess {String}  message      Password reset success message
     *
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Incorrect resetToken
     */
    .post(validate(AuthValidator.reset), AuthController.reset);

  router.route('/auth/google')
    .get(passport.authenticate('google', { scope: ['email'] }));

  router.route('/auth/google/callback')
    .get(passport.authenticate('google'), AuthController.oauth);

  router.route('/auth/google/success')
    .get((req, res) => {
      console.log(res);
      res.send(res.data);
    });

  router.route('/auth/facebook')
    .get(passport.authenticate('facebook'));

  router.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook', { failureRedirect: '/' }, (req, res) => {
      console.log('callback susscess response');
      console.log(res.data);
      res.send('success');
    }));

  router.route('/auth/facebook/success')
    .get((req, res) => { res.send(res.data); });

  return router;
};

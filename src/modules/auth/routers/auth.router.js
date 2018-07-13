const express = require('express');
const validate = require('express-validation');

const AuthController = require('../controllers/auth.controller');
const AuthValidator = require('../validators/auth.validator');

const router = express.Router();

router
  .route('/signup')
  /**
   * @api {post} /signup Signup user
   * @apiDescription Register user with direct email address
   * @apiVersion 0.0.1
   * @apiName EmailSignup
   * @apiGroup Auth
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

router
  .route('/signin')
  /**
   * @api {post} /signin SigninUser
   * @apiDescription User login with direct email address
   * @apiVersion 0.0.1
   * @apiName EmailSignin
   * @apiGroup Auth
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

module.exports = router;

const express = require('express');
const validation = require('express-validation');
const UserController = require('../controllers/user.controller');
const UserValidator = require('../validators/user.validator');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} /user Create user
   * @apiDescription Create new user only by admin
   * @apiVersion 0.0.1
   * @apiName CreateUser
   * @apiGroup User
   *
   * @apiParam  {String}          firstName         User's first name
   * @apiParam  {String}          lastName          User's last name
   * @apiParam  {String}          email             User's email
   * @apiParam  {String{6..128}}  password          User's password
   * @apiParam  {Number{0-9}}     phone             User's phone
   * @apiParam  {String}          address.street    User's street address
   * @apiParam  {String}          address.area      User's area
   * @apiParam  {String}          address.city      User's city
   * @apiParam  {String}          address.state     User's state
   * @apiParam  {String}          address.pincode   User's pincode
   * @apiParam  {String}          address.lat       User's latitude
   * @apiParam  {String}          address.long      User's longitude
   * @apiParam  {String}          address.tag       User's tag [home, work]
   * @apiParam  {String}          gender            User's gender
   * @apiParam  {Date}            birthDate         User's birthDate
   * @apiParam  {String}          picture           User's pictures
   * @apiParam  {String}          bio               User's biography
   *
   * @apiSuccess (Created 201) {ID}      _id                User's id
   * @apiSuccess (Created 201) {String}  firstName          User's first name
   * @apiSuccess (Created 201) {String}  lastName           User's last name
   * @apiSuccess (Created 201) {String}  email              User's email
   * @apiSuccess (Created 201) {Number}  phone              User's phone
   * @apiSuccess (Created 201) {String}  address.street     User's street address
   * @apiSuccess (Created 201) {String}  address.area       User's area
   * @apiSuccess (Created 201) {String}  address.city       User's city
   * @apiSuccess (Created 201) {String}  address.state      User's state
   * @apiSuccess (Created 201) {String}  address.pincode    User's pincode
   * @apiSuccess (Created 201) {String}  address.lat        User's latitude
   * @apiSuccess (Created 201) {String}  address.long       User's longitude
   * @apiSuccess (Created 201) {String}  address.tag        User's tags
   * @apiSuccess (Created 201) {String}  gender             User's gender
   * @apiSuccess (Created 201) {String}  birthDate          User's birthdate
   * @apiSuccess (Created 201) {String}  picture            User's picture
   * @apiSuccess (Created 201) {String}  bio                User's biography
   * @apiSuccess (Created 201) {String}  activate.token     User activation token
   * @apiSuccess (Created 201) {String}  activate.expireAt  User activation token expiry time
   * @apiSuccess (Created 201) {Date}    createdAt          User created timestamp
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .post(validation(UserValidator.create), UserController.create);

module.exports = router;

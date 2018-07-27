const validation = require('express-validation');
const UserController = require('../controllers/user.controller');
const UserValidator = require('../validators/user.validator');
require('module-alias/register');
const { isLoggedIn } = require('@system').authenticate; // eslint-disable-line

module.exports = (router) => {
  /**
   * Add isLoggedIn middleware for all the below requests
   */
  // router.use('/users', isLoggedIn());

  router
    .route('/users')
    /**
     * @api {post} /user List user
     * @apiDescription List all users only for admin
     * @apiVersion 0.0.1
     * @apiName ListUser
     * @apiGroup User
     *
     * @apiParam  {String}          [select]      User select column names [email,phone,*]
     * @apiParam  {Object}          [filter]      User filter object [email,phone]
     * @apiParam  {Object}          [with]        User reference objects
     * @apiParam  {Number{1-}}      [offset=1]    List offset
     * @apiParam  {Number{1-100}}   [limit=10]    List records limit
     * @apiParam  {String}          [order]       User list order by [createdAt, city]
     * @apiParam  {String=asc,desc} [sort]        User order sort by [asc, desc]
     *
     * @apiSuccess (Ok 200) {ID}      _id                User's id
     * @apiSuccess (Ok 200) {String}  firstName          User's first name
     * @apiSuccess (Ok 200) {String}  lastName           User's last name
     * @apiSuccess (Ok 200) {String}  email              User's email
     * @apiSuccess (Ok 200) {Number}  phone              User's phone
     * @apiSuccess (Ok 200) {String}  address.street     User's street address
     * @apiSuccess (Ok 200) {String}  address.area       User's area
     * @apiSuccess (Ok 200) {String}  address.city       User's city
     * @apiSuccess (Ok 200) {String}  address.state      User's state
     * @apiSuccess (Ok 200) {String}  address.pincode    User's pincode
     * @apiSuccess (Ok 200) {String}  address.lat        User's latitude
     * @apiSuccess (Ok 200) {String}  address.long       User's longitude
     * @apiSuccess (Ok 200) {String}  address.tag        User's tags
     * @apiSuccess (Ok 200) {String}  gender             User's gender
     * @apiSuccess (Ok 200) {String}  birthDate          User's birthdate
     * @apiSuccess (Ok 200) {String}  picture            User's picture
     * @apiSuccess (Ok 200) {String}  bio                User's biography
     * @apiSuccess (Ok 200) {String}  activate.token     User activation token
     * @apiSuccess (Ok 200) {String}  activate.expireAt  User activation token expiry time
     * @apiSuccess (Ok 200) {Date}    createdAt          User created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(validation(UserValidator.list), UserController.list)
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
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .post(validation(UserValidator.create), UserController.create);

  router
    .route('/users/:userId')
    /**
     * @api {post} /user/:userId Get user
     * @apiDescription Get user details
     * @apiVersion 0.0.1
     * @apiName GetUser
     * @apiGroup User
     *
     * @apiParam  {ID}    userId         User's _id
     *
     * @apiSuccess (Ok 200) {ID}      _id                User's id
     * @apiSuccess (Ok 200) {String}  firstName          User's first name
     * @apiSuccess (Ok 200) {String}  lastName           User's last name
     * @apiSuccess (Ok 200) {String}  email              User's email
     * @apiSuccess (Ok 200) {Number}  phone              User's phone
     * @apiSuccess (Ok 200) {String}  address.street     User's street address
     * @apiSuccess (Ok 200) {String}  address.area       User's area
     * @apiSuccess (Ok 200) {String}  address.city       User's city
     * @apiSuccess (Ok 200) {String}  address.state      User's state
     * @apiSuccess (Ok 200) {String}  address.pincode    User's pincode
     * @apiSuccess (Ok 200) {String}  address.lat        User's latitude
     * @apiSuccess (Ok 200) {String}  address.long       User's longitude
     * @apiSuccess (Ok 200) {String}  address.tag        User's tags
     * @apiSuccess (Ok 200) {String}  gender             User's gender
     * @apiSuccess (Ok 200) {String}  birthDate          User's birthdate
     * @apiSuccess (Ok 200) {String}  picture            User's picture
     * @apiSuccess (Ok 200) {String}  bio                User's biography
     * @apiSuccess (Ok 200) {String}  activate.token     User activation token
     * @apiSuccess (Ok 200) {String}  activate.expireAt  User activation token expiry time
     * @apiSuccess (Ok 200) {Date}    createdAt          User created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(validation(UserValidator.get), UserController.get)
    /**
     * @api {post} /user Create user
     * @apiDescription Create new user only by admin
     * @apiVersion 0.0.1
     * @apiName CreateUser
     * @apiGroup User
     *
     * @apiParam  {ID}              userId            User's _id
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
     * @apiSuccess (Ok 200) {ID}      _id                User's id
     * @apiSuccess (Ok 200) {String}  firstName          User's first name
     * @apiSuccess (Ok 200) {String}  lastName           User's last name
     * @apiSuccess (Ok 200) {String}  email              User's email
     * @apiSuccess (Ok 200) {Number}  phone              User's phone
     * @apiSuccess (Ok 200) {String}  address.street     User's street address
     * @apiSuccess (Ok 200) {String}  address.area       User's area
     * @apiSuccess (Ok 200) {String}  address.city       User's city
     * @apiSuccess (Ok 200) {String}  address.state      User's state
     * @apiSuccess (Ok 200) {String}  address.pincode    User's pincode
     * @apiSuccess (Ok 200) {String}  address.lat        User's latitude
     * @apiSuccess (Ok 200) {String}  address.long       User's longitude
     * @apiSuccess (Ok 200) {String}  address.tag        User's tags
     * @apiSuccess (Ok 200) {String}  gender             User's gender
     * @apiSuccess (Ok 200) {String}  birthDate          User's birthdate
     * @apiSuccess (Ok 200) {String}  picture            User's picture
     * @apiSuccess (Ok 200) {String}  bio                User's biography
     * @apiSuccess (Ok 200) {String}  activate.token     User activation token
     * @apiSuccess (Ok 200) {String}  activate.expireAt  User activation token expiry time
     * @apiSuccess (Ok 200) {Date}    createdAt          User created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .put(validation(UserValidator.update), UserController.update)
    /**
     * @api {post} /user Create user
     * @apiDescription Create new user only by admin
     * @apiVersion 0.0.1
     * @apiName CreateUser
     * @apiGroup User
     *
     * @apiParam  {ID}    userId         User's _id
     *
     * @apiSuccess (NO CONTENT 204) NULL
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .delete(validation(UserValidator.delete), UserController.delete);

  /**
   * Load tag when API with tagId route parameter is hit
   */
  router.param('userId', UserController.load);

  return router;
};

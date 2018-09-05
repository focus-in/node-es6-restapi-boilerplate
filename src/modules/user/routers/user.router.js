const controller = require('../controllers/user.controller');
const validator = require('../validators/user.validator');
const middleware = require('../middlewares/user.middleware');
require('module-alias/register');
const { isLoggedIn, isAdmin } = require('@system').authenticate; // eslint-disable-line

module.exports = (router, validate) => {
  /**
   * Add isLoggedIn middleware for all the below requests
   */
  router.use('/users', isLoggedIn());

  router
    .route('/users')
    /**
     * @api {post} /users List user
     * @apiDescription List all users only for admin
     * @apiVersion 0.0.1
     * @apiName ListUser
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization  Admin access auth token
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
    .get(isAdmin(), validate(validator.list), middleware.queryBuilder, controller.list)
    /**
     * @api {post} /users Create user
     * @apiDescription Create new user only by admin
     * @apiVersion 0.0.1
     * @apiName CreateUser
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization  Admin access auth token
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
    .post(isAdmin(), validate(validator.create), controller.create);

  router
    .route('/users/profile')
    /**
     * @api {post} /users/profile Get loggedin user profile
     * @apiDescription List all users only for admin
     * @apiVersion 0.0.1
     * @apiName ListUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization  Users access auth token
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
    .get(middleware.queryBuilder, controller.profile);

  router
    .route('/users/:userId')
    /**
     * @api {post} /users/:userId Get user
     * @apiDescription Get user details
     * @apiVersion 0.0.1
     * @apiName GetUser
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization  Admin access auth token
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
    .get(isAdmin(), validate(validator.get), middleware.queryBuilder, controller.get)
    /**
     * @api {put} /users/:userId Update user
     * @apiDescription Update user details
     * @apiVersion 0.0.1
     * @apiName UpdateUser
     * @apiGroup User
     * @apiPermission user
     *
     * @apiHeader {String} Authorization  Users access auth token
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
    .put(validate(validator.update), controller.update)
    /**
     * @api {delete} /users/:userId Delete user
     * @apiDescription Delete user only by admin
     * @apiVersion 0.0.1
     * @apiName DeleteUser
     * @apiGroup User
     * @apiPermission admin
     *
     * @apiHeader {String} Authorization  Admin access auth token
     *
     * @apiParam  {ID}    userId         User's _id
     *
     * @apiSuccess (NO CONTENT 204) NULL
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .delete(isAdmin(), validate(validator.delete), controller.delete);

  /**
   * Load user when API with userId route parameter is hit
   */
  router.param('userId', controller.load);

  return router;
};

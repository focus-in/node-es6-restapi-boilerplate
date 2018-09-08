const controller = require('../controllers/address.controller');
const validator = require('../validators/address.validator');
const middleware = require('../middlewares/address.middleware');
require('module-alias/register');
const { isLoggedIn } = require('@system').authenticate; // eslint-disable-line

module.exports = (router, validate) => {
  /**
   * Add isLoggedIn middleware for all the address requests
   */
  router.use('/address', isLoggedIn());

  router
    .route('/address')
    /**
     * @api {get} /address List all Address
     * @apiDescription List all address
     * @apiVersion 0.0.1
     * @apiName ListAddress
     * @apiGroup Address
     * @apiPermission user
     *
     * @apiHeader {String} Authorization  Users access auth token
     *
     * @apiParam  {String}          [select]      Address select column names [city,state,*]
     * @apiParam  {Object}          [filter]      Address filter object [city,state]
     * @apiParam  {Object}          [with]        Address reference objects
     * @apiParam  {Number{1-}}      [offset=1]    List offset
     * @apiParam  {Number{1-100}}   [limit=10]    List records limit
     * @apiParam  {String}          [order]       Address list order by [createdAt, city]
     * @apiParam  {String=asc,desc} [sort]        Address order sort by [asc, desc]
     *
     * @apiSuccess (Ok 200) {Number}         count               Address list total count
     * @apiSuccess (Ok 200) {ID}             address._id         Address id
     * @apiSuccess (Ok 200) {String}         address.street      Address street
     * @apiSuccess (Ok 200) {String}         address.area        Address area
     * @apiSuccess (Ok 200) {String}         address.city        Address city
     * @apiSuccess (Ok 200) {String}         address.state       Address state
     * @apiSuccess (Ok 200) {String}         address.landmark    Address landmark
     * @apiSuccess (Ok 200) {Number{0-9}}    address.pincode     Address pincode
     * @apiSuccess (Ok 200) {Number{0-9}}    address.lat         Address lat
     * @apiSuccess (Ok 200) {Number{0-9}}    address.long        Address long
     * @apiSuccess (Ok 200) {String}         address.tag         Address tag
     * @apiSuccess (Ok 200) {Date}           address.createdAt   Address created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(validate(validator.list), middleware.queryBuilder, controller.list)
    /**
     * @api {post} /address Save new Address
     * @apiDescription Create new address
     * @apiVersion 0.0.1
     * @apiName CreateAddress
     * @apiGroup Address
     * @apiPermission user
     *
     * @apiHeader {String} Authorization  Users access auth token
     *
     * @apiParam  {String}          street      Address street
     * @apiParam  {String}          area        Address area
     * @apiParam  {String}          city        Address city
     * @apiParam  {String}          state       Address state
     * @apiParam  {String}          landmark    Address landmark
     * @apiParam  {Number{0-9}}     pincode     Address pincode
     * @apiParam  {Number{0-9}}     lat         Address lat
     * @apiParam  {Number{0-9}}     long        Address long
     * @apiParam  {String}          tag         Address tag
     *
     * @apiSuccess (Created 201) {ID}             _id         Address id
     * @apiSuccess (Created 201) {String}         street      Address street
     * @apiSuccess (Created 201) {String}         area        Address area
     * @apiSuccess (Created 201) {String}         city        Address city
     * @apiSuccess (Created 201) {String}         state       Address state
     * @apiSuccess (Created 201) {String}         landmark    Address landmark
     * @apiSuccess (Created 201) {Number{0-9}}    pincode     Address pincode
     * @apiSuccess (Created 201) {Number{0-9}}    lat         Address lat
     * @apiSuccess (Created 201) {Number{0-9}}    long        Address long
     * @apiSuccess (Created 201) {String}         tag         Address tag
     * @apiSuccess (Created 201) {Date}           createdAt   Address created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .post(validate(validator.create), controller.create);

  router
    .route('/address/:addressId')
    /**
     * @api {get} /address/:addressId Get address
     * @apiDescription Get address details by addressId
     * @apiVersion 0.0.1
     * @apiName GetAddress
     * @apiGroup Address
     * @apiPermission user
     *
     * @apiHeader {String} Authorization  Users access auth token
     *
     * @apiParam  {ID}    addressId       Address _id
     *
     * @apiSuccess (Ok 200) {ID}             _id         Address id
     * @apiSuccess (Ok 200) {String}         street      Address street
     * @apiSuccess (Ok 200) {String}         area        Address area
     * @apiSuccess (Ok 200) {String}         city        Address city
     * @apiSuccess (Ok 200) {String}         state       Address state
     * @apiSuccess (Ok 200) {String}         landmark    Address landmark
     * @apiSuccess (Ok 200) {Number{0-9}}    pincode     Address pincode
     * @apiSuccess (Ok 200) {Number{0-9}}    lat         Address lat
     * @apiSuccess (Ok 200) {Number{0-9}}    long        Address long
     * @apiSuccess (Ok 200) {String}         tag         Address tag
     * @apiSuccess (Ok 200) {Date}           createdAt   Address created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(validate(validator.get), middleware.queryBuilder, controller.get)
    /**
     * @api {put} /address/:addressId Update address details
     * @apiDescription Update address
     * @apiVersion 0.0.1
     * @apiName UpdateAddress
     * @apiGroup Address
     * @apiPermission user
     *
     * @apiHeader {String} Authorization  Users access auth token
     *
     * @apiParam  {ID}            addressId   Address _id
     * @apiParam  {String}        street      Address street
     * @apiParam  {String}        area        Address area
     * @apiParam  {String}        city        Address city
     * @apiParam  {String}        state       Address state
     * @apiParam  {String}        landmark    Address landmark
     * @apiParam  {Number{0-9}}   pincode     Address pincode
     * @apiParam  {Number{0-9}}   lat         Address lat
     * @apiParam  {Number{0-9}}   long        Address long
     * @apiParam  {String}        tag         Address tag
     *
     * @apiSuccess (Ok 200) {ID}             _id         Address id
     * @apiSuccess (Ok 200) {String}         street      Address street
     * @apiSuccess (Ok 200) {String}         area        Address area
     * @apiSuccess (Ok 200) {String}         city        Address city
     * @apiSuccess (Ok 200) {String}         state       Address state
     * @apiSuccess (Ok 200) {String}         landmark    Address landmark
     * @apiSuccess (Ok 200) {Number{0-9}}    pincode     Address pincode
     * @apiSuccess (Ok 200) {Number{0-9}}    lat         Address lat
     * @apiSuccess (Ok 200) {Number{0-9}}    long        Address long
     * @apiSuccess (Ok 200) {String}         tag         Address tag
     * @apiSuccess (Ok 200) {Date}           createdAt   Address created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .put(validate(validator.update), controller.update)
    /**
     * @api {delete} /address/:addressId Delete address details
     * @apiDescription Delete address
     * @apiVersion 0.0.1
     * @apiName DeleteAddress
     * @apiGroup Address
     * @apiPermission user
     *
     * @apiHeader {String} Authorization  Users access auth token
     *
     * @apiParam  {ID}    addressId       Address _id
     *
     * @apiSuccess (No Content 204)   NULL
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .delete(validate(validator.delete), controller.delete);

  /**
   * Load address on :addressId route
   */
  router.param('addressId', controller.load);

  return router;
};

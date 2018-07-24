const validation = require('express-validation');
const ActivityController = require('../controllers/activity.controller');
const ActivityValidator = require('../validators/activity.validator');
require('module-alias/register');
const { isLoggedIn } = require('@system').authenticate; // eslint-disable-line

module.exports = (router) => {
  /**
   * Add isLoggedIn middleware for all the activities requests
   */
  router.use('/activities', isLoggedIn());

  router
    .route('/activities')
    /**
     * @api {get} /activity List all Activity
     * @apiDescription List all activity
     * @apiVersion 0.0.1
     * @apiName ListActivity
     * @apiGroup Activity
     *
     * @apiParam  {String}          [select]      Activity select column names [city,state,*]
     * @apiParam  {Object}          [filter]      Activity filter object [city,state]
     * @apiParam  {Object}          [with]        Activity reference objects
     * @apiParam  {Number{1-}}      [offset=1]    List offset
     * @apiParam  {Number{1-100}}   [limit=10]    List records limit
     * @apiParam  {String}          [order]       Activity list order by [createdAt, city]
     * @apiParam  {String=asc,desc} [sort]        Activity order sort by [asc, desc]
     *
     * @apiSuccess (Ok 200) {Number}         count               Activity list total count
     * @apiSuccess (Ok 200) {ID}             activity._id         Activity id
     * @apiSuccess (Ok 200) {String}         activity.street      Activity street
     * @apiSuccess (Ok 200) {String}         activity.area        Activity area
     * @apiSuccess (Ok 200) {String}         activity.city        Activity city
     * @apiSuccess (Ok 200) {String}         activity.state       Activity state
     * @apiSuccess (Ok 200) {String}         activity.landmark    Activity landmark
     * @apiSuccess (Ok 200) {Number{0-9}}    activity.pincode     Activity pincode
     * @apiSuccess (Ok 200) {Number{0-9}}    activity.lat         Activity lat
     * @apiSuccess (Ok 200) {Number{0-9}}    activity.long        Activity long
     * @apiSuccess (Ok 200) {String}         activity.tag         Activity tag
     * @apiSuccess (Ok 200) {Date}           activity.createdAt   Activity created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(validation(ActivityValidator.list), ActivityController.list)
    /**
     * @api {post} /activity Save new Activity
     * @apiDescription Create new activity
     * @apiVersion 0.0.1
     * @apiName CreateActivity
     * @apiGroup Activity
     *
     * @apiParam  {String}          street      Activity street
     * @apiParam  {String}          area        Activity area
     * @apiParam  {String}          city        Activity city
     * @apiParam  {String}          state       Activity state
     * @apiParam  {String}          landmark    Activity landmark
     * @apiParam  {Number{0-9}}     pincode     Activity pincode
     * @apiParam  {Number{0-9}}     lat         Activity lat
     * @apiParam  {Number{0-9}}     long        Activity long
     * @apiParam  {String}          tag         Activity tag
     *
     * @apiSuccess (Created 201) {ID}             _id         Activity id
     * @apiSuccess (Created 201) {String}         street      Activity street
     * @apiSuccess (Created 201) {String}         area        Activity area
     * @apiSuccess (Created 201) {String}         city        Activity city
     * @apiSuccess (Created 201) {String}         state       Activity state
     * @apiSuccess (Created 201) {String}         landmark    Activity landmark
     * @apiSuccess (Created 201) {Number{0-9}}    pincode     Activity pincode
     * @apiSuccess (Created 201) {Number{0-9}}    lat         Activity lat
     * @apiSuccess (Created 201) {Number{0-9}}    long        Activity long
     * @apiSuccess (Created 201) {String}         tag         Activity tag
     * @apiSuccess (Created 201) {Date}           createdAt   Activity created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .post(validation(ActivityValidator.create), ActivityController.create);

  router
    .route('/activities/:activityId')
    /**
     * @api {get} /activity/:activityId Get activity
     * @apiDescription Get activity details by activityId
     * @apiVersion 0.0.1
     * @apiName GetActivity
     * @apiGroup Activity
     *
     * @apiParam  {ID}    activityId       Activity _id
     *
     * @apiSuccess (Ok 200) {ID}             _id         Activity id
     * @apiSuccess (Ok 200) {String}         street      Activity street
     * @apiSuccess (Ok 200) {String}         area        Activity area
     * @apiSuccess (Ok 200) {String}         city        Activity city
     * @apiSuccess (Ok 200) {String}         state       Activity state
     * @apiSuccess (Ok 200) {String}         landmark    Activity landmark
     * @apiSuccess (Ok 200) {Number{0-9}}    pincode     Activity pincode
     * @apiSuccess (Ok 200) {Number{0-9}}    lat         Activity lat
     * @apiSuccess (Ok 200) {Number{0-9}}    long        Activity long
     * @apiSuccess (Ok 200) {String}         tag         Activity tag
     * @apiSuccess (Ok 200) {Date}           createdAt   Activity created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(validation(ActivityValidator.get), ActivityController.get)
    /**
     * @api {put} /activity/:activityId Update activity details
     * @apiDescription Update activity
     * @apiVersion 0.0.1
     * @apiName UpdateActivity
     * @apiGroup Activity
     *
     * @apiParam  {ID}            activityId   Activity _id
     * @apiParam  {String}        street      Activity street
     * @apiParam  {String}        area        Activity area
     * @apiParam  {String}        city        Activity city
     * @apiParam  {String}        state       Activity state
     * @apiParam  {String}        landmark    Activity landmark
     * @apiParam  {Number{0-9}}   pincode     Activity pincode
     * @apiParam  {Number{0-9}}   lat         Activity lat
     * @apiParam  {Number{0-9}}   long        Activity long
     * @apiParam  {String}        tag         Activity tag
     *
     * @apiSuccess (Ok 200) {ID}             _id         Activity id
     * @apiSuccess (Ok 200) {String}         street      Activity street
     * @apiSuccess (Ok 200) {String}         area        Activity area
     * @apiSuccess (Ok 200) {String}         city        Activity city
     * @apiSuccess (Ok 200) {String}         state       Activity state
     * @apiSuccess (Ok 200) {String}         landmark    Activity landmark
     * @apiSuccess (Ok 200) {Number{0-9}}    pincode     Activity pincode
     * @apiSuccess (Ok 200) {Number{0-9}}    lat         Activity lat
     * @apiSuccess (Ok 200) {Number{0-9}}    long        Activity long
     * @apiSuccess (Ok 200) {String}         tag         Activity tag
     * @apiSuccess (Ok 200) {Date}           createdAt   Activity created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .put(validation(ActivityValidator.update), ActivityController.update)
    /**
     * @api {put} /activity/:activityId Update activity details
     * @apiDescription Update activity
     * @apiVersion 0.0.1
     * @apiName UpdateActivity
     * @apiGroup Activity
     *
     * @apiParam  {ID}    activityId       Activity _id
     *
     * @apiSuccess (No Content 204)   NULL
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .delete(validation(ActivityValidator.delete), ActivityController.delete);

  /**
   * Load activity on :activityId route
   */
  router.param('activityId', ActivityController.load);

  return router;
};

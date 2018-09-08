const controller = require('../controllers/activity.controller');
const validator = require('../validators/activity.validator');
const middleware = require('../middlewares/activity.middleware');
require('module-alias/register');
const { isLoggedIn, isAdmin } = require('@system').authenticate; // eslint-disable-line

module.exports = (router, validate) => {
  /**
   * Add isLoggedIn middleware for all the activities requests
   */
  router.use('/activities', isLoggedIn());

  router
    .route('/activities')
    /**
     * @api {get} /activities List all Activity
     * @apiDescription List all activity
     * @apiVersion 0.0.1
     * @apiName ListActivity
     * @apiGroup Activity
     * @apiPermission user
     *
     * @apiHeader {String} Authorization  Users access auth token
     *
     * @apiParam  {String}          [select]      Activity select column names [city,state,*]
     * @apiParam  {Object}          [filter]      Activity filter object [city,state]
     * @apiParam  {Object}          [with]        Activity reference objects
     * @apiParam  {Number{1-}}      [offset=1]    List offset
     * @apiParam  {Number{1-100}}   [limit=10]    List records limit
     * @apiParam  {String}          [order]       Activity list order by [createdAt, city]
     * @apiParam  {String=asc,desc} [sort]        Activity order sort by [asc, desc]
     *
     * @apiSuccess (Ok 200) {Number}     count                  Activity list total count
     * @apiSuccess (Ok 200) {ID}         activity._id           Activity id
     * @apiSuccess (Ok 200) {ID}         activity._userId       Activity user id
     * @apiSuccess (Ok 200) {Object}     activity.action        Activity action object
     * @apiSuccess (Ok 200) {String}     activity.action.id     Activity action module id
     * @apiSuccess (Ok 200) {String}     activity.action.module Activity action module name
     * @apiSuccess (Ok 200) {Object}     activity.action.data   Activity action module data
     * @apiSuccess (Ok 200) {String}     activity.message       Activity message
     * @apiSuccess (Ok 200) {Date}       activity.createdAt     Activity created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(validate(validator.list), middleware.queryBuilder, controller.list);

  router
    .route('/activities/:activityId')
    /**
     * @api {get} /activities/:activityId Get activity
     * @apiDescription Get activity details by activityId
     * @apiVersion 0.0.1
     * @apiName GetActivity
     * @apiGroup Activity
     * @apiPermission user
     *
     * @apiHeader {String} Authorization  Users access auth token
     *
     * @apiParam  {ID}    activityId       Activity _id
     *
     * @apiSuccess (Ok 200) {ID}         _id           Activity id
     * @apiSuccess (Ok 200) {ID}         _userId       Activity user id
     * @apiSuccess (Ok 200) {Object}     action        Activity action object
     * @apiSuccess (Ok 200) {String}     action.id     Activity action module id
     * @apiSuccess (Ok 200) {String}     action.module Activity action module name
     * @apiSuccess (Ok 200) {Object}     action.data   Activity action module data
     * @apiSuccess (Ok 200) {String}     message       Activity message
     * @apiSuccess (Ok 200) {Date}       createdAt     Activity created timestamp
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(validate(validator.get), middleware.queryBuilder, controller.get)
    /**
     * @api {delete} /activities/:activityId Delete activity details
     * @apiDescription Delete activity
     * @apiVersion 0.0.1
     * @apiName DeleteActivity
     * @apiGroup Activity
     * @apiPermission user
     *
     * @apiHeader {String} Authorization  Users access auth token
     *
     * @apiParam  {ID}    activityId       Activity _id
     *
     * @apiSuccess (No Content 204)   NULL
     *
     * @apiError (Bad Request 400)   Bad Request   Invalid request data
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .delete(isAdmin(), validate(validator.delete), controller.delete);

  /**
   * Load activity on :activityId route
   */
  router.param('activityId', controller.load);

  return router;
};

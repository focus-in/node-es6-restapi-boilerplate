require('module-alias/register');

/**
 * Only admin or same user will be valid access
 *
 * @param {Object} user Logged in user object
 * @param {Object} locals accessing id user object
 */
exports.verifyValidAccess = ({ user, locals }) => {
  // check only admin can update other users
  if (user.role !== 'admin' && user._id.toString() !== locals.user._id.toString()) {
    const err = new Error('Invalid access');
    err.status = 403; // FORBIDDEN
    throw err;
  }
  return true;
};

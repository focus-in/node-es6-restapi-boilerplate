const HttpStatus = require('http-status');
const UserModel = require('../models/user.model');

exports.create = async (req, res, next) => {
  try {
    const User = new UserModel(req.body);
    const user = await User.save();
    // set the status & return the user object
    res.status(HttpStatus.CREATED);
    return res.json(user);
  } catch (e) {
    return next(e);
  }
};

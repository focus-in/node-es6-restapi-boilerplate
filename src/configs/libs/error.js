const HttpStatus = require('http-status');
const { error, image } = require('../env');

/**
 * Check duplication error
 * if error is a mongoose duplicate key error
 *
 * @param {Error} err
 * @returns {Error response}
 */
const errorDuplicate = (err) => {
  // get the duplicate key index
  const begin = err.errmsg.lastIndexOf('index: ') + 7;
  let fieldName = err.errmsg.substring(begin, err.errmsg.lastIndexOf('_1'));
  fieldName = `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)} already exists`;
  // check email/userName validation errors
  return {
    status: HttpStatus.CONFLICT,
    name: err.name,
    message: 'Validation Error',
    errors: [{
      field: fieldName,
      location: 'body',
      messages: [`${fieldName} already exists`],
    }],
    isPublic: true,
    stack: errorStack(err.stack),
  };
};

const errorMessage = (err) => {
  let message;
  if (err.message) {
    ({ message } = err);
  } else if (err.code) {
    switch (err.code) {
      case 'UNSUPPORTED_MEDIA_TYPE':
        message = 'Unsupported filetype';
        break;
      case 'LIMIT_FILE_SIZE':
        message = `Image file too large. Maximum size allowed is ${(image.fileSizeLimit / (1024 * 1024)).toFixed(2)} Mb files.`;
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Missing `newProfilePicture` field';
        break;
      default:
        message = 'Something went wrong!';
    }
  } else {
    message = 'Oops, Something went wrong!';
  }
  return message;
};

/**
 * Limit Error stack string
 */
const errorStack = (errStack) => {
  // check if err stach is jndefined
  if (errStack) {
    const errStackLimit = error.stackLimit || 6;
    return errStack.split('\n').slice(0, errStackLimit).join('\n');
  }
  return '';
};

exports.errorResponse = (err) => {
  // check for duplicate error
  if (err.name === 'MongoError' || err.code === 11000) {
    return errorDuplicate(err);
  }
  // return common error response object
  return {
    status: err.status ? err.status : HttpStatus.BAD_REQUEST,
    name: err.name ? err.name : 'ApiError',
    message: errorMessage(err),
    errors: err.errors ? err.errors : [],
    isPublic: true,
    stack: errorStack(err.stack),
    info: err.info ? err.info : {},
  };
};

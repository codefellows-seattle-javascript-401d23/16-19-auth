'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (error, request, response, next) {
  // eslint-disable-line no-unused-vars
  _logger2.default.log(_logger2.default.ERROR, '__ERROR_MIDDLEWARE__');
  _logger2.default.log(_logger2.default.ERROR, error);
  // looking out for error.status
  if (error.status) {
    _logger2.default.log(_logger2.default.INFO, 'ERROR MIDDLEWARE1: Responding with a ' + error.status + ' code and message ' + error.message);
    return response.sendStatus(error.status);
  }
  // if the code makes it here then it's a non http type error....
  var errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('objectid failed')) {
    _logger2.default.log(_logger2.default.INFO, 'ERROR MIDDLEWARE2: Responding with a error 404 code');
    return response.sendStatus(404);
  }
  if (errorMessage.includes('validation failed')) {
    _logger2.default.log(_logger2.default.INFO, 'ERROR MIDDLEWARE3: Responding with an error 400 code');
    return response.sendStatus(400);
  }
  if (errorMessage.includes('duplicate key')) {
    _logger2.default.log(_logger2.default.INFO, 'ERROR MIDDLEWARE4: Responding with an error 409 code');
    return response.sendStatus(409);
  }
  if (errorMessage.includes('unauthorized')) {
    _logger2.default.log(_logger2.default.INFO, 'ERROR MIDDLEWARE5: Responding with an error 401 code');
    return response.sendStatus(401);
  }
  _logger2.default.log(_logger2.default.ERROR, 'ERROR MIDDLEWARE6: Responding with a 500 error code');
  return response.sendStatus(500);
};
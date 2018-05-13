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
  // I know I might have the property error.status
  if (error.status) {
    _logger2.default.log(_logger2.default.INFO, 'Responding with a ' + error.status + ' code and message ' + error.message + '.');
    return response.sendStatus(error.status);
  }
  // ----------------------------------------------------
  // I know that if we are here, it's another type or error 
  // (e.g. internal express or node errors etc)
  var errorMessage = error.message.toLowerCase();
  if (errorMessage.includes('objectid failed')) {
    _logger2.default.log(_logger2.default.INFO, 'Responding with a 404 status code.');
    return response.sendStatus(404);
  }
  if (errorMessage.includes('validation failed')) {
    _logger2.default.log(_logger2.default.INFO, 'Responding with a 400 status code.');
    return response.sendStatus(400);
  }
  if (errorMessage.includes('duplicate key')) {
    _logger2.default.log(_logger2.default.INFO, 'Responding with a 409 status code.');
    return response.sendStatus(409);
  }
  if (errorMessage.includes('unauthorized')) {
    _logger2.default.log(_logger2.default.INFO, 'Responding with a 401 status code.');
    return response.sendStatus(401);
  }
  // ---------------------------------------------------------------------------------------------
  // TODO: write jsonWebToken error handling.
  // ---------------------------------------------------------------------------------------------
  _logger2.default.log(_logger2.default.ERROR, 'Responding with a 500 error code.');
  _logger2.default.log(_logger2.default.ERROR, error.message);
  return response.sendStatus(500);
};
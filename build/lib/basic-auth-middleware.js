'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (request, response, next) {
  // check request.headers.authorization contains username and password
  // parse username and password from base 64 to string split on ':'
  // find the account, and then login 
  if (!request.headers.authorization) {
    return next(new _httpErrors2.default(400, 'Authorization invalid request'));
  }
  var base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if (!base64AuthHeader) {
    return next(new _httpErrors2.default(400, 'Authorization invalid request error 2'));
  }
  // convert from base 64 to string is username:password
  var stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  var usernamePassword = stringAuthHeader.split(':');
  // or const [username, password] = stringAuthHeader.split(':'); 
  // assigns local variables to those array values
  if (!username || !password) {
    return next(new _httpErrors2.default(400, 'Authorization invalid request error 3'));
  }
  return _account2.default.findOne({ username: username }).then(function (account) {
    if (!account) {
      return next(new _httpErrors2.default(400, 'Authorization invalid request error 4'));
    }
    return _account2.default.verifyPassword(password);
  }).then(function (account) {
    request.account = account;
    return next(); // calls next function in middleware
  }).catch(next);
};
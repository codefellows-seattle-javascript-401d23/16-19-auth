'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: wrapping
var promisify = function promisify(fn) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (result, reject) {
      fn.apply(undefined, args.concat([function (error, data) {
        if (error) {
          return reject(error); // goes to the next catch
        }
        return result(data); // goes to the next .then
      }]));
    });
  };
};

exports.default = function (request, response, next) {
  // console.log(request.headers.authorization, 'inside of bearer-auth-middleware');
  if (!request.headers.authorization) {
    return next(new _httpErrors2.default(400, 'Auth - __ERROR__ authorization header required'));
  }

  var token = request.headers.authorization.split('Bearer ')[1];

  if (!token) {
    return next(new _httpErrors2.default(400, 'Auth - __ERROR__ token required'));
  }

  return promisify(_jsonwebtoken2.default.verify)(token, process.env.THE_DESPERATE_SECRET).catch(function (error) {
    return Promise.reject(new _httpErrors2.default(401, error));
  }).then(function (decryptedToken) {
    return _account2.default.findOne({ tokenSeed: decryptedToken.tokenSeed });
  }).then(function (account) {
    if (!account) {
      throw new _httpErrors2.default(404, 'Auth - __ERROR__ not found');
    }
    request.account = account;
    return next();
  }).catch(next);
};
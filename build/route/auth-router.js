'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _basicAuthMiddleware = require('../lib/basic-auth-middleware');

var _basicAuthMiddleware2 = _interopRequireDefault(_basicAuthMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authRouter = new _express.Router();
var jsonParser = _bodyParser2.default.json();

authRouter.post('/signup', jsonParser, function (request, response, next) {
  if (!request.body.username || !request.body.email || !request.body.password) {
    return next(new _httpErrors2.default(400, '__ERROR__ username, email, and password required to create an account'));
  }

  return _account2.default.create(request.body.username, request.body.email, request.body.password).then(function (account) {
    delete request.body.password;
    _logger2.default.log(_logger2.default.INFO, 'AUTH - Creating Token');
    return account.createToken();
  }).then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'AUTH - Returning a 200 status and a token');
    return response.json({ token: token });
  }).catch(next);
});

authRouter.get('/login', _basicAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, '_ERROR_ not found'));
  }

  return request.account.createToken().then(function (token) {
    return response.json({ token: token });
  }).catch(next);
});

exports.default = authRouter;
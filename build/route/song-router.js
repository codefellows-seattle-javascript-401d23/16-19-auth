'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _song = require('../model/song');

var _song2 = _interopRequireDefault(_song);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = _bodyParser2.default.json();

var songRouter = new _express.Router();

songRouter.post('/songs', _bearerAuthMiddleware2.default, jsonParser, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'ERROR - not found'));
  }

  return new _song2.default(_extends({}, request.body, {
    account: request.account._id
  })).save().then(function (song) {
    return response.json(song);
  }).catch(next);
});

songRouter.get('/songs', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(400, 'Auth - Invalid request'));
  }

  return request.song.pCreateToken().then(function (token) {
    _logger2.default.log(_logger2.default.INFO, 'Getting a song');
    return response.json({ token: token });
  });
});

exports.default = songRouter;
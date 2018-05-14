'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _item = require('../model/item');

var _item2 = _interopRequireDefault(_item);

var _s = require('../lib/s3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line

var multerUpload = (0, _multer2.default)({ dest: __dirname + '/../temp' });
var itemRouter = new _express.Router();

itemRouter.post('/item', _bearerAuthMiddleware2.default, multerUpload.any(), function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'ITEM ROUTER __ERROR__ invalied request'));
  }

  var file = request.files[0];
  var key = file.filename + '.' + file.originalname;

  return (0, _s.s3Upload)(file.path, key).then(function (url) {
    return new _item2.default({
      title: request.body.title,
      account: request.account._id,
      url: url
    }).save();
  }).then(function (sound) {
    return response.json(sound);
  }).catch(next);
});

exports.default = itemRouter;
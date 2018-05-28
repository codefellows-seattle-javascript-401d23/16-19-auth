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

var _image = require('../model/image');

var _image2 = _interopRequireDefault(_image);

var _s = require('../lib/s3');

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var multerUpload = (0, _multer2.default)({ dest: __dirname + '/temp' }); /*eslint-disable-line*/


var imageRouter = new _express.Router();

imageRouter.post('/images', _bearerAuthMiddleware2.default, multerUpload.any(), function (request, response, next) {
  // console.log(request.account, 'hello there'); // the image is not attached to the account yet...
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'IMAGE ROUTER _ERROR_, not found'));
  }
  // console.log(request.body, 'hello there'); // the image mock is created...

  if (!request.body || request.files.length > 1 || request.files[0].fieldname !== 'image') {
    return next(new _httpErrors2.default(400, 'IMAGE ROUTER __ERROR__ invalid request'));
  }

  var file = request.files[0];
  var key = file.filename + '.' + file.originalname;

  return (0, _s.s3Upload)(file.path, key).then(function (url) {
    // console.log('in .then of upload in route');
    return new _image2.default({
      artist: request.body.artist,
      account: request.account._id,
      url: url
    }).save();
  }).then(function (image) {
    return response.json(image);
  }).catch(next);
});

imageRouter.get('/images/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.headers.authorization) {
    return next(new _httpErrors2.default(401, 'IMAGE ROUTER _ERROR_, no id in request body'));
  }
  return _image2.default.findById(request.params._id).then(function (image) {
    _logger2.default.log(_logger2.default.INFO, 'GET - responding with a 200 status code');
    return response.json(image);
  }).catch(next);
});

exports.default = imageRouter;
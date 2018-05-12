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

var _picture = require('../model/picture');

var _picture2 = _interopRequireDefault(_picture);

var _s = require('../lib/s3');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var multerUpload = (0, _multer2.default)({ dest: __dirname + '/../temp' });

var pictureRouter = new _express.Router();

pictureRouter.post('/pictures', _bearerAuthMiddleware2.default, multerUpload.any(), function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'PICTURE ROUTER _ERROR_, not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'picture') {
    return next(new _httpErrors2.default(400, 'PICTURE ROUTER __ERROR__ invalid request'));
  }

  var file = request.files[0];
  var key = file.filename + '.' + file.originalname;

  return (0, _s.s3Upload)(file.path, key).then(function (awsUrl) {
    return new _picture2.default({
      title: request.body.title,
      account: request.account._id,
      url: awsUrl
    }).save();
  }).then(function (picture) {
    return response.json(picture);
  }).catch(next);
});

// write a get route here 
pictureRouter.get('/pictures/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  getdatabase.findById();
});

// write a delete route here (utilizing the s3Remove method to target an ID)
pictureRouter.delete('/pictures/:id', _bearerAuthMiddleware2.default, function (request, response, next) {});

exports.default = pictureRouter;
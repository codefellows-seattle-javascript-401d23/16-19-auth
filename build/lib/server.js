'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopServer = exports.startServer = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _router = require('../route/router');

var _router2 = _interopRequireDefault(_router);

var _errorMiddleware = require('./error-middleware');

var _errorMiddleware2 = _interopRequireDefault(_errorMiddleware);

var _loggerMiddleware = require('./logger-middleware');

var _loggerMiddleware2 = _interopRequireDefault(_loggerMiddleware);

var _pictureRouter = require('../route/picture-router');

var _pictureRouter2 = _interopRequireDefault(_pictureRouter);

var _profileRouter = require('../route/profile-router');

var _profileRouter2 = _interopRequireDefault(_profileRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = null;
//---------------------------------------------------------------------------------
// (1) link in the chain
app.use(_loggerMiddleware2.default); // middleware
app.use(_router2.default);
app.use(_profileRouter2.default);
app.use(_pictureRouter2.default);
//---------------------------------------------------------------------------------
// (2) link in the chain
app.all('*', function (request, response) {
  _logger2.default.log(_logger2.default.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});
//---------------------------------------------------------------------------------
// (3) link in the chain
app.use(_errorMiddleware2.default);
//---------------------------------------------------------------------------------

var startServer = function startServer() {
  return _mongoose2.default.connect(process.env.MONGODB_URI).then(function () {
    server = app.listen(process.env.PORT, function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is listening on port ' + process.env.PORT);
    });
  });
};

var stopServer = function stopServer() {
  return _mongoose2.default.disconnect().then(function () {
    server.close(function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is off');
    });
  });
};

exports.startServer = startServer;
exports.stopServer = stopServer;
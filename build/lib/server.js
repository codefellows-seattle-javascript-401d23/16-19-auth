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

var _authRouter = require('../route/auth-router');

var _authRouter2 = _interopRequireDefault(_authRouter);

var _profileRouter = require('../route/profile-router');

var _profileRouter2 = _interopRequireDefault(_profileRouter);

var _itemRouter = require('../route/item-router');

var _itemRouter2 = _interopRequireDefault(_itemRouter);

var _loggerMiddleware = require('./logger-middleware');

var _loggerMiddleware2 = _interopRequireDefault(_loggerMiddleware);

var _errorMiddleware = require('./error-middleware');

var _errorMiddleware2 = _interopRequireDefault(_errorMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var server = null;

app.use(_loggerMiddleware2.default);
app.use(_authRouter2.default);
app.use(_profileRouter2.default);
app.use(_itemRouter2.default);
app.all('*', function (request, response) {
  _logger2.default.log(_logger2.default.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});
app.use(_errorMiddleware2.default);

var startServer = function startServer() {
  return _mongoose2.default.connect(process.env.MONGODB_URI).then(function () {
    server = app.listen(process.env.PORT, function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is listening on port ' + process.env.PORT);
    });
    return undefined;
  }).catch(function (err) {
    _logger2.default.log(_logger2.default.ERROR, 'something happended, ' + JSON.stringify(err));
  });
};

var stopServer = function stopServer() {
  return _mongoose2.default.disconnect().then(function () {
    // console.log('!!!!THIS IS THE SEVER AT STOP SERVER', server);
    server.close(function () {
      _logger2.default.log(_logger2.default.INFO, 'Server is off');
    });
  }).catch(function (err) {
    return _logger2.default.log(_logger2.default.ERROR, 'something happend, ' + JSON.stringify(err));
  });
};

exports.startServer = startServer;
exports.stopServer = stopServer;
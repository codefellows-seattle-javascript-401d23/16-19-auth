'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT + '/signup';

describe('AUTH Router', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_accountMock.pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', function () {
    return _superagent2.default.post(apiURL).send({
      username: 'Manana',
      email: 'manana@gmail.com',
      password: 'banana'
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    });
  });
  test('POST - should return a 400 status code ', function () {
    return _superagent2.default.post(apiURL).send({
      email: '',
      password: 'Willy'
    }).then(Promise.reject).catch(function (error) {
      expect(error.status).toEqual(400);
    });
  });
  test('Should return a code 409', function () {
    return (0, _accountMock.pCreateAccountMock)().then(function (mockObjProm) {
      var mockAccount = {
        email: mockObjProm.account.email,
        password: 'faux password'
      };
      return _superagent2.default.post(apiURL).send(mockAccount).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(409);
      });
    });
  });
});
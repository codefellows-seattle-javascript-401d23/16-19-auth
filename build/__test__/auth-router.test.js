'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('AUTH Router', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_accountMock.pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: 'demi',
      email: 'demi@dog.com',
      password: 'woof'
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    });
  });

  test('POST should return a 400 status code Bad Request for not sending the correct sign up information', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: '',
      email: '',
      password: ''
    }).then(function (response) {
      console.log(response, 'bad request test');
      expect(response.sendStatus).toEqual(400);
    });
  });

  test('GET /login should return a 200 status code and a Token on success', function () {
    return (0, _accountMock.pCreateAccountMock)().then(function (mock) {
      console.log(mock.request.username, mock.request.password);
      return _superagent2.default.get(apiURL + '/login').auth(mock.request.username, mock.request.password);
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    });
  });

  test('GET /login should return a 400 status if a bad request is made to the database', function () {
    return (0, _accountMock.pCreateAccountMock)().then(function (mock) {
      var mockAccount = {
        username: mock.account.username,
        email: mock.account.email,
        password: 'wrong password'
      };
      return _superagent2.default.post(apiURL).send(mockAccount).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(404);
      });
    });
  });

  test('GET /login should return a 404 status code if no account is found', function () {
    return (0, _accountMock.pCreateAccountMock)().then(function (mock) {
      var mockAccount = {
        username: mock.account.username,
        email: mock.account.email,
        password: 'wrong password'
      };
      return _superagent2.default.post(apiURL).send(mockAccount).then(Promise.reject).catch(function (error) {
        expect(error.status).toEqual(404);
      });
    });
  });
});
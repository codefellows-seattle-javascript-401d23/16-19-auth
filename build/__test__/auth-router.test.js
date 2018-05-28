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

  test('POST /signup - an incomplete request should return a 400', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: 'demi',
      email: 'demi@dog.com'
    }).then(Promise.reject).catch(function (response) {
      expect(response.status).toEqual(400);
    });
  });

  // describe('GET /login', () => {
  //   test('GET /login should return a 200 status code and a Token on success', () => {
  //     return pCreateAccountMock()
  //       .then((mock) => {
  //         // console.log(mock.request.username, mock.request.password);
  //         return superagent.get(`${apiURL}/login`)
  //           .auth(mock.request.username, mock.request.password);
  //       })
  //       .then((response) => {
  //         expect(response.status).toEqual(200);
  //         expect(response.body.token).toBeTruthy();
  //       });
  //   });
  // });


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
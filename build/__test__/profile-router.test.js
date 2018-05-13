'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _profileMock = require('./lib/profile-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('POST /profiles', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_profileMock.removeProfileMock);

  test('POST /profiles should get a 200 and the newly created profile.', function () {
    var accountMock = null;
    return (0, _accountMock.createAccountMock)().then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiURL + '/profiles').set('Authorization', 'Bearer ' + accountSetMock.token) // the capital A is required.
      .send({
        firstName: 'Dan',
        birthdate: '06/01/1990',
        quote: 'random quote.'
      });
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.account).toEqual(accountMock.account._id.toString());
      expect(response.body.firstName).toEqual('Dan');
      expect(/^1990-06-01/.test(response.body.birthdate)).toBeTruthy();
      expect(response.body.quote).toEqual('random quote.');
    });
  });
  test('POST /profiles should return a 400 status code if there were missing required values.', function () {
    return (0, _accountMock.createAccountMock)().then(function (accountSetMock) {
      return _superagent2.default.post(apiURL + '/profiles').set('Authorization', 'Bearer ' + accountSetMock.token) // the capital A is required.
      .send({
        birthdate: '06/01/1990',
        quote: 'random quote.'
      });
    }).then(Promise.reject).catch(function (error) {
      expect(error.status).toEqual(400);
    });
  });
});
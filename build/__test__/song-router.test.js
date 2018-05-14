'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _songMock = require('./lib/song-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('POST /songs', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_songMock.pRemoveSongMock);

  test('POST /songs - should get a 200 if no errors and a song', function () {
    var accountMock = null;
    return (0, _accountMock.pCreateAccountMock)() // need to create an account before you can make a song...
    .then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiURL + '/songs').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        song: 'Trouble',
        artist: 'The Desperate',
        genre: 'Indie Rock'
      });
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.account).toEqual(accountMock.account._id.toString());
      expect(response.body.song).toEqual('Trouble');
      expect(response.body.artist).toEqual('The Desperate');
      expect(response.body.genre).toEqual('Indie Rock');
    });
  });

  test('GET /songs - the test should get a 200 if no errors and a song is returned', function () {
    return (0, _songMock.pCreateSongMock)().then(function (mock) {
      return _superagent2.default.get(apiURL + '/songs').auth(mock.request.username, mock.request.password);
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    });
  });
});
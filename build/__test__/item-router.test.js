'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _itemMock = require('./lib/item-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('TESTING ROUTES AT /item', function () {
  beforeAll(_server.startServer);
  afterEach(_itemMock.pRemoveItemMock);
  afterAll(_server.stopServer);

  describe('POST 200 for successful post /item', function () {
    test('should return 200 for sucessful item post', function () {
      return (0, _itemMock.pCreateItemMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        console.log(mockResponse);
        return _superagent2.default.post(apiURL + '/item').set('Authorization', 'Bearer ' + token).field('title', 'josh-pic').attach('item', __dirname + '/asset/josh.jpg').then(function (response) {
          console.log('TEST RESPONSE', response);
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('josh-pic');
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
      }).catch(function (err) {
        // console.log(err.message, 'ERROR IN TEST');
        expect(err.status).toEqual(200);
      });
    });
  });
});
'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _imageMock = require('./lib/image-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = 'http://localhost:' + process.env.PORT;

describe('Testing routes at /images', function () {
  beforeAll(_server.startServer);
  afterEach(_imageMock.pRemoveImageMock);
  afterAll(_server.stopServer);

  describe('POST 200 for successful post to /images', function () {
    test('the route should return 200 for successful image posted and return a artist, account ID and a URL', function () {
      jest.setTimeout(20000);
      return (0, _imageMock.pCreateImageMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;
        // console.log(mockResponse.accountMock, 'before post');

        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer ' + token).field('artist', 'llama1').attach('image', __dirname + '/assets/llama1.jpg').then(function (response) {
          expect(response.status).toEqual(200);
          expect(response.body.artist).toEqual('llama1');
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
      }).catch(function (err) {
        console.log(err.message, 'ERR IN TEST');
        console.log(err.message, 'ERROR Status 401');
        expect(err.status).toEqual(200);
      });
    });
  });

  describe('POST 401 unsuccessful post to /images', function () {
    test('the route should return 401 for jwt malformed token due to no account', function () {
      jest.setTimeout(20000);
      return (0, _imageMock.pCreateImageMock)().then(function (mockResponse) {
        var token = mockResponse.token;
        // console.log(mockResponse.accountMock, 'before post');

        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer ' + token).field('artist', 'llama1').attach('image', __dirname + '/assets/llama1.jpg').then(Promise.reject);
      }).catch(function (err) {
        console.log(err.message, 'ERR IN TEST');
        console.log(err.message, 'ERROR Status 401');
        expect(err.status).toEqual(401);
      });
    });
  });

  describe('POST 400 unsuccessful post to /images', function () {
    test('the route should return 400 due to a bad request if there are missing fields in the multi-form upload', function () {
      jest.setTimeout(20000);
      return (0, _imageMock.pCreateImageMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;
        // console.log(mockResponse.accountMock, 'before post');

        return _superagent2.default.post(apiUrl + '/images').set('Authorization', 'Bearer ' + token).field('artist', '').attach('', __dirname + '/assets/llama1.jpg').then(function (response) {
          expect(response.status).toEqual(400);
        });
      }).catch(function (err) {
        console.log(err.message, 'ERR IN TEST');
        console.log(err.message, 'ERROR Status 400');
        expect(err.status).toEqual(400);
      });
    });
  });

  describe('GET 200 for successful get from /images:id', function () {
    test('the GET route should return a 200 for successful image retrieved', function () {
      return (0, _imageMock.pCreateImageMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;
        // console.log(mockResponse.accountMock, 'mock inside the get route');

        return _superagent2.default.get(apiUrl + '/images/:id').set('Authorization', 'Bearer ' + token);
      }).then(function (response) {
        expect(response.status).toEqual(200);
      }).catch(function (err) {
        console.log(err.message, 'ERR IN TEST');
        console.log(err.message, 'ERROR STATUS 404');
        expect(err.status).toEqual(200);
      });
    });
  });
});
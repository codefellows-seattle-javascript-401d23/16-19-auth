'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _pictureMock = require('./lib/picture-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// set this to true or false depending on if you want to hit the mock AWS-SDK or 
// if you want to hit the real AWS-SDK, i.e., upload an asset to your real bucket

var apiUrl = 'http://localhost:' + process.env.PORT;

describe('TESTING ROUTES AT /pictures', function () {
  beforeAll(_server.startServer);
  afterEach(_pictureMock.pRemovePictureMock);
  afterAll(_server.stopServer);

  describe('POST 200 for successful post /pictures', function () {
    test('should return 200 for sucessful picture post', function () {
      // only do this if you have a slow computer AND you want to make a real API call to S3
      jest.setTimeout(20000);
      return (0, _pictureMock.pCreatePictureMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.post(apiUrl + '/pictures').set('Authorization', 'Bearer ' + token).field('title', 'picture of doggo').attach('picture', __dirname + '/assets/doggo.jpg').then(function (response) {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('picture of doggo');
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
      }).catch(function (err) {
        console.log(err.message, 'ERR IN TEST');
        console.log(err.status, 'CODE ERR IN TEST');
        expect(err.status).toEqual(200);
      });
    });
    test('POST 400 for bad request to the /pictures route', function () {});
    // test('POST 401 unauthorized request - no token', () => {
    //   return pCreatePictureMock()
    //     .then((mockResponse) => {
    //       const { token } = mockResponse.accountMock;
    //       console.log(token);
    //       return superagent.post(`${apiUrl}/pictures`)
    //         .set('Authorization', 'Bearer badToken')
    //         .field('title', 'picture of doggo')
    //         .attach('picture', `${__dirname}/assets/doggo.jpg`)
    //         .then(Promise.reject);
    //     })
    //     .catch((err) => {
    //       console.log(err.message, 'ERROR 401 IN TEST');
    //       console.log(err.status, 'CODE ERR IN TEST');
    //       expect(err.status).toEqual(401);
    //     });
    // });
  });
});
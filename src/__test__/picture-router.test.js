'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemovePictureMock, pCreatePictureMock } from './lib/picture-mock';

// set this to true or false depending on if you want to hit the mock AWS-SDK or 
// if you want to hit the real AWS-SDK, i.e., upload an asset to your real bucket

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /pictures', () => {
  beforeAll(startServer);
  afterEach(pRemovePictureMock);
  afterAll(stopServer);

  describe('POST 200 for successful post /pictures', () => {
    test('should return 200 for sucessful picture post', () => {
      // only do this if you have a slow computer AND you want to make a real API call to S3
      jest.setTimeout(20000);
      return pCreatePictureMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiUrl}/pictures`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'picture of doggo')
            .attach('picture', `${__dirname}/assets/doggo.jpg`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('picture of doggo');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          console.log(err.message, 'ERR IN TEST');
          console.log(err.status, 'CODE ERR IN TEST');
          expect(err.status).toEqual(200);
        });
    });
    test('POST 400 for bad request to the /pictures route', () => {
      
    });
    test('POST 401 unauthorized request - no token', () => {
      return pCreatePictureMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          console.log(token);
          return superagent.post(`${apiUrl}/pictures`)
            .set('Authorization', 'Bearer badToken')
            .field('title', 'picture of doggo')
            .attach('picture', `${__dirname}/assets/doggo.jpg`)
            .then(Promise.reject);
        })
        .catch((err) => {
          console.log(err.message, 'ERROR 401 IN TEST');
          console.log(err.status, 'CODE ERR IN TEST');
          expect(err.status).toEqual(401);
        });
    });
  });
});

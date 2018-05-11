'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateImageMock, pRemoveImageMock } from './lib/image-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

// double check that I'm using IMAGE and file path and info is correct.
// this note is due to following along in class...Judy is making a sound

describe('Testing routes at /images', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveImageMock);

  describe('POST 200 for successful post to /images', () => {
    test('should return 200', () => {
      // jest.setTimeout(10000);
      return pCreateImageMock()
        .then((mockResponse) => {
          // console.log('mock image created.');
          // const token = mockResponse.accountMock.token
          const { token } = mockResponse.accountMock; // same as above line
          // console.log(token, 'this is the token');
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'image of dog') // or object literal?
            .attach('image', `${__dirname}/assets/dog.jpg`) // make sure this file path is correct.
            .then((response) => {
              console.log(response.body, 'this is the response body');
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('image of dog');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          console.log('this is in the catch of the test');
          expect(err.status).toEqual(200);
        });
    });
  });

  describe('GET /images/:id', () => {
    test('GET /images/:id should return a 200 status code and the image with the requested id', () => {
      let accountInstance;
      return pCreateImageMock()
        .then((mockAccount) => {
          accountInstance = mockAccount;
          console.log(mockAccount.image, 'this is the mock image');
          return superagent.get(`${apiUrl}/images/${mockAccount.image._id}`)
            .set('Authorization', `Bearer ${mockAccount.accountMock.token}`);
        })
        .then((response) => {
          console.log(response.body, 'this is the response');
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual(accountInstance.image.title);
          expect(response.body.url).toEqual(accountInstance.image.url);
        });
    });

    test('GET /images/:id should return a 404 error status code if sent with a bad id', () => {
      return pCreateImageMock()
        .then((mockAccount) => {
          console.log(mockAccount.image, 'this is the mock image');
          return superagent.get(`${apiUrl}/images/thisIsAnInvalidId`)
            .set('Authorization', `Bearer ${mockAccount.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });

  describe('DELETE /images/:id', () => {
    test('DELETE /images/:id should return a 204 status code if the image is not there', () => {
      return pCreateImageMock()
        .then((mockAccount) => {
          return superagent.delete(`${apiUrl}/images/${mockAccount.image._id}`)
            .set('Authorization', `Bearer ${mockAccount.accountMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
  });
});

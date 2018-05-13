'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveImageMock, pCreateImageMock } from './lib/image-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('Testing routes at /images', () => {
  beforeAll(startServer);
  afterEach(pRemoveImageMock);
  afterAll(stopServer);

  describe('POST 200 for successful post to /images', () => {
    test('the route should return 200 for successful image posted and return a artist, account ID and a URL', () => {
      jest.setTimeout(20000);
      return pCreateImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          // console.log(mockResponse.accountMock, 'before post');
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('artist', 'llama1')
            .attach('image', `${__dirname}/assets/llama1.jpg`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.artist).toEqual('llama1');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          console.log(err.message, 'ERR IN TEST');
          console.log(err.message, 'ERROR Status 401');
          expect(err.status).toEqual(200);
        });
    });
  });

  describe('POST 401 unsuccessful post to /images', () => {
    test('the route should return 401 for jwt malformed token due to no account', () => {
      jest.setTimeout(20000);
      return pCreateImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse;
          // console.log(mockResponse.accountMock, 'before post');
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('artist', 'llama1')
            .attach('image', `${__dirname}/assets/llama1.jpg`)
            .then(Promise.reject);
        })
        .catch((err) => {
          console.log(err.message, 'ERR IN TEST');
          console.log(err.message, 'ERROR Status 401');
          expect(err.status).toEqual(401);
        });
    });
  });

  describe('POST 400 unsuccessful post to /images', () => {
    test('the route should return 400 due to a bad request if there are missing fields in the multi-form upload', () => {
      jest.setTimeout(20000);
      return pCreateImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          // console.log(mockResponse.accountMock, 'before post');
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('artist', '')
            .attach('', `${__dirname}/assets/llama1.jpg`)
            .then((response) => {
              expect(response.status).toEqual(400);
            });
        })
        .catch((err) => {
          console.log(err.message, 'ERR IN TEST');
          console.log(err.message, 'ERROR Status 400');
          expect(err.status).toEqual(400);
        });
    });
  });


  describe('GET 200 for successful get from /images:id', () => {
    test('the GET route should return a 200 for successful image retrieved', () => {
      return pCreateImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          // console.log(mockResponse.accountMock, 'mock inside the get route');
          return superagent.get(`${apiUrl}/images/:id`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
        })
        .catch((err) => {
          console.log(err.message, 'ERR IN TEST');
          console.log(err.message, 'ERROR STATUS 404');
          expect(err.status).toEqual(200);
        });
    });
  });
});

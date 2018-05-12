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
          console.log(mockResponse.accountMock, 'before post');
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
          console.log(mockResponse.accountMock, 'before post');
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

  
  describe('GET 200 for successful get from /images', () => {
    test('the route should return a 200 for successful image retrieved', () => {
      return pCreateImageMock()
        .then((mock) => {
          console.log(mock, 'mock inside the get route');
          return superagent.get(`${apiUrl}/images`)
            .auth(mock.request.token, mock.request.password);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
        });
    });
  });
});

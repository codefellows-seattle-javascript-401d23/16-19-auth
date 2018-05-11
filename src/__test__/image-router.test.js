'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateImageMock, pRemoveImageMock } from './lib/image-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('Testing routes at /images', () => {
  beforeAll(startServer);
  afterEach(pRemoveImageMock);
  afterAll(stopServer);

  describe('POST 200 for successful post to /images', () => {
    test('the route should return 200 for successful image posted', () => {
      return pCreateImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          // console.log('before post');
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('artist', 'llama')
            .attach('image', `${__dirname}/assets/llama1.jpg`)
            .then((response) => {
              // console.log(response);
              expect(response.status).toEqual(200);
            });
        })
        .catch((err) => {
          console.log(err.message, 'ERROR IN TEST');
          console.log(err.status, 'CODE ERROR IN TEST');
          expect(err.status).toEqual(200);
        });
    });
  });
  
  describe('GET 200 for successful get from /images', () => {
    test('the route should return a 200 for successful image retrieved', () => {
      return pCreateImageMock()
        .then((mock) => {
          return superagent.get(`${apiUrl}/images`)
            .auth(mock.request.username, mock.request.password);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
        });
    });
  });
});

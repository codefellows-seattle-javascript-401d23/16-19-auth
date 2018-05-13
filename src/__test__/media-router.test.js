'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { pCreateMediaMock, pRemoveMediaMock } from './lib/media-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /media', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveMediaMock);

  describe('POST  /media', () => {
    test('200 for successful media post', () => {
      // jest.setTimeout(10000);
      return pCreateMediaMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiURL}/media`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'Marbles Bitmap')
            .attach('media', `${__dirname}/assets/marbles.bmp`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('Marbles Bitmap');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          expect(err.status).toEqual(200);
        });
    });
    test('POST - 400 for bad request', () => {
      const mediaToPost = {
        title: faker.lorem.words(5),
        mediaType: faker.lorem.words(2),
        url: faker.random.image(),
      };
      return superagent.post(`${apiURL}/media`)
        .send(mediaToPost)
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });
    test('POST - 401 for invalid token', () => {
      return superagent.post(`${apiURL}/media`)
        .set('Authorization', 'Bearer thisIsNotAValidToken')
        .field('title', 'Marbles Bitmap')
        .attach('media', `${__dirname}/assets/marbles.bmp`)
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
  });
});

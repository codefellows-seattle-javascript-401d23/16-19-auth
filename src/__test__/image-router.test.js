'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateImageMock, pRemoveImageMock } from './lib/image-mock';
// import logger from '../lib/logger';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /images', () => {
  beforeAll(startServer);
  afterEach(pRemoveImageMock);
  afterAll(stopServer);

  describe('POST 200 for successful post /images', () => {
    test('should return 200 for successful image post', () => {
      return pCreateImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'beach sunset')
            .attach('image', `${__dirname}/asset/sunset.jpg`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('beach sunset');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          expect(err.status).toEqual(200);
        });
    });
    test('should return 400 for no token', () => {
      return pCreateImageMock()
        .then(() => {
          // const { token } = mockResponse.accountMock;
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', 'no token')
            .field('title', 'beach sunset')
            .attach('image', `${__dirname}/asset/sunset.jpg`)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(400);
            });
        });
    });
  });
});

// test('GET /profiles:/id return profile by ID', () => {
//   let profileMock = null;
//   return pCreateProfileMock()
//     .then(profileMock)
//   profileMock = profile;
//   return superagent.get(`${apiURL}/${profile._id}`);
// });

'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveImageMock, pCreateImageMock } from './lib/image-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /images', () => {
  beforeAll(startServer);
  afterEach(pRemoveImageMock);
  afterAll(stopServer);

  describe('POST 200 for successful post /images', () => {
    test('should return 200 for successful image post', () => {
      // jest.setTimeout(200000);
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
          console.log(err.message, 'ERR IN TEST');
          console.log(err.status, 'CODE ERR IN TEST');
          expect(err.status).toEqual(200);
        });
    });
  });
});


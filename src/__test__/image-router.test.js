'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from './lib/image-mock';
import { pRemoveImageMock, pCreateImageMock } from './lib/image-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /images', () => {
  beforeAll(startServer);
  afterEach(pRemoveSoundMock);
  afterAll(stopServer);

  describe('POST 200 for successful post /images', () => {
    test('should return 200 for successful image post', () => {
      // jest.setTimeout(200000);
      return pCreateImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'beach sunset')
            .attach('sound', `${__dirname}/asset/sunset.jpg`)
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
        experect(err.status).toEqual(200);
      };
    });
  });
});


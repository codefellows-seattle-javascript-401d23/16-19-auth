'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveItemMock, pCreateItemMock } from './lib/item-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /item', () => {
  beforeAll(startServer);
  afterEach(pRemoveItemMock);
  afterAll(stopServer);

  describe('POST 200 for successful post /item', () => {
    test('should return 200 for sucessful item post', () => {
      return pCreateItemMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiURL}/item`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'josh-pic')
            .attach('item', `${__dirname}/asset/josh.jpg`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('josh-pic');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          // console.log(err.message, 'ERROR IN TEST');
          expect(err.status).toEqual(200);
        });
    });
  });
});


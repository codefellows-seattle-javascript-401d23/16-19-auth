'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveAccountMock, pCreateAccountMock } from './lib/account-mock';


const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('AUTH Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', () => {
    return superagent.post(apiURL)
      .send({
        username: 'Manana',
        email: 'manana@gmail.com',
        password: 'banana',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('POST - should return a 400 status code ', () => {
    return superagent.post(apiURL)
      .send({
        email: '',
        password: 'Willy',
      })
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(400);
      })
  });
  test('Should return a code 409', () => {
    return pCreateAccountMock()
      .then((mockObjProm) => {
        const mockAccount = {
          email: mockObjProm.account.email,
          password: 'faux password',
        };
        return superagent.post(apiURL)
          .send(mockAccount)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(409);
          });
      });
  });
});

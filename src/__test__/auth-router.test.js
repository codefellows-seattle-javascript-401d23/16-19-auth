'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock, pRemoveAccountMock } from './lib/account-mock';
// import { pRemoveAccountMock } from './lib/account-mock';

const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('AUTH Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', () => {
    return superagent.post(apiURL)
      .send({
        username: 'dawn',
        email: 'dawnstarr.aldrich@gmail.com',
        password: 'starr',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('POST should return a 400 status code for bad request', () => {
    return superagent.post(apiURL)
      .send({
        password: 'starr',
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  test('409 due to duplicate name', () => {
    return pCreateAccountMock()
      .then((mockFromPromise) => {
        const mockAcct = {
          username: mockFromPromise.account.username,
          email: mockFromPromise.account.email,
          password: 'fake password',
        };
        console.log(mockAcct, ' Mock Account');
        return superagent.post(apiURL)
          .send(mockAcct)
          .then(Promise.reject)
          .catch((err) => {
            expect(err.status).toEqual(409);
          });
      });
  });
});

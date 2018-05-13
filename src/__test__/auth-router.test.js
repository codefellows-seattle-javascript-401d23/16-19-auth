'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock, pRemoveAccountMock } from './lib/account-mock';

const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('AUTH Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  describe('POST /signup', () => {
    test('POST should return a 200 status code and a TOKEN', () => {
      return superagent.post(apiURL)
        .send({
          username: 'darwin',
          email: 'darwin@squareandplum.com',
          password: 'meow!',
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
    test('POST - 400 for bad request', () => {
      return superagent.post(apiURL)
        .send({
          username: 'penelope',
          email: 'penelope@squareandplum.com',
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });
    test('POST - 409 for duplicate key', () => {
      return pCreateAccountMock()
        .then((account) => {
          const accountToPost = {
            username: account.request.username,
            email: 'darwin@squareandplum.com',
            password: 'meow!',
          };
          return superagent.post(apiURL)
            .send(accountToPost)
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(409);
            });
        });
    });
  });
});

'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock, removeAccountMock } from '../__test__/lib/account-mock';

const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('AUTH ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAccountMock);
  
  test('POST - should return a 200 status code and a TOKEN.', () => {
    return superagent.post(apiURL)
      .send({
        username: 'dan',
        email: 'dandan@dan.com',
        password: 'notdan',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('POST - should return a 400 status code if request had missing required values.', () => {
    return superagent.post(apiURL)
      .send({
        username: 'dan2',
        email: 'dandan@dan2.com',
      })
      .catch((error) => {
        expect(error.status).toEqual(400);
      });
  });
  test('POST - should return a 409 status code if a duplicate key was passed.', () => {
    return createAccountMock()
      .then((savedUser) => {
        const mockUser = {
          username: 'dan3',
          email: savedUser.account.email,
          password: 'foo',
        };
        return superagent.post(apiURL)
          .send(mockUser);
      })
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(409);
      });
  });
});

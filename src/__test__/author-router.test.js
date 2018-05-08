'use strict';

import superagent from 'superagent';
import faker from 'faker';
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
        username: 'julian',
        email: 'julian@smith.com',
        password: 'hotkoolaid',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  
  test('POST should return a 400 status code', () => {
    const userToPost = {
      username: faker.lorem.words(10),
      password: faker.lorem.words(10),
    };
    return superagent.post(apiURL)
      .send(userToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('POST should return a 409 status code', () => {
    return pCreateAccountMock()
      .then((mockAccount) => {
        return superagent.post(apiURL)
          .send({
            username: mockAccount.account.username,
            email: faker.lorem.words(20),
            password: faker.lorem.words(20),
          });
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(409);
      });
  });
});

'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock, pRemoveAccountMock } from './lib/account-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('AUTH Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'demi',
        email: 'demi@dog.com',
        password: 'woof',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('POST /signup - an incomplete request should return a 400', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'demi',
        email: 'demi@dog.com',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  // describe('GET /login', () => {
  //   test('GET /login should return a 200 status code and a Token on success', () => {
  //     return pCreateAccountMock()
  //       .then((mock) => {
  //         // console.log(mock.request.username, mock.request.password);
  //         return superagent.get(`${apiURL}/login`)
  //           .auth(mock.request.username, mock.request.password);
  //       })
  //       .then((response) => {
  //         expect(response.status).toEqual(200);
  //         expect(response.body.token).toBeTruthy();
  //       });
  //   });
  // });


  test('GET /login should return a 400 status if a bad request is made to the database', () => {
    return pCreateAccountMock()
      .then((mock) => {
        const mockAccount = {
          username: mock.account.username,
          email: mock.account.email,
          password: 'wrong password',
        };
        return superagent.post(apiURL)
          .send(mockAccount)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
  });

  test('GET /login should return a 404 status code if no account is found', () => {
    return pCreateAccountMock()
      .then((mock) => {
        const mockAccount = {
          username: mock.account.username,
          email: mock.account.email,
          password: 'wrong password',
        };
        return superagent.post(apiURL)
          .send(mockAccount)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
  });
});

'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock, pRemoveAccountMock } from './lib/account-mock';
// import logger from '../lib/logger';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('AUTH Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  // working
  test('POST should return a 200 status code and a TOKEN', () => {
    return superagent.post(`${apiURL}/signup`)
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
    return superagent.post(`${apiURL}/signup`)
      .send({
        email: 'dawnstarr.aldrich@gmail.com',
        password: 'starr',
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  describe('GET /login', () => {
    test('GET /login should get a 200 status code and a token if there are no errors', () => {
      return pCreateAccountMock()
        .then((mock) => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
    // test('GET /login should get a 400 status code for bad request', () => {
    //   return pCreateAccountMock()
    //     .then((mock) => {
    //       return superagent.get(`${apiURL}/login`)
    //         .auth(mock.request.username, 'bad password');
    //     })
    //     .then((response) => {
    //       expect(response.status).toEqual(400);
    //     });
    // });
    test('GET /login should get a 404 status code for a bad request', () => {
      return pCreateAccountMock()
        .then((mock) => {
          return superagent.get(`${apiURL}/login/notfound`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
});

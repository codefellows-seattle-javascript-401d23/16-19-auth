'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveAccountMock } from './lib/account-mock';


const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('AUTH Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', () => {
    return superagent.post(apiURL)
      .send({
        username: 'Josh',
        email: 'uafredrickson@gmail.com',
        password: 'kids',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('GET sending an empty object, should fail and return a 400', () => {
    return superagent.post(apiURL)
      .send({
        username: ,
        email: 'uafredrickson@gmail.com',
        password: 'kids',
      })
      .then((response) => {
        expect(response.status).toEqual(400);
      });
  });
});

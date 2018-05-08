'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/mock-account';
import { pRemoveProfileMock } from './lib/profile-mock';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveProfileMock);

  test('POST /profiles should return a 200 status code if successful and the newly created profile', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            mantra: 'I like coffee',
            firstName: 'Carl',
            lastName: 'Olson',
          });
      })
      .then((response) => {
        console.log(response, 'this is the response status');
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Carl');
        expect(response.body.lastName).toEqual('Olson');
        expect(response.body.mantra).toEqual('I like coffee');
      });
  });
});

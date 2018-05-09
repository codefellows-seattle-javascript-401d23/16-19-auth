'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
import { pRemoveProfileMock } from './lib/profile-mock';

const apiUrl= `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () =>  {
  beforeAll(startServer);
  afterAll(stopServer());
  afterEach(pRemoveProfileMock);

  test('POST /profiles should get a 200 and a newly created profile', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Athorization', `Bearer ${accountSetmock.token}`)
          .send({
            firstName: 'Josh',
            lastName: 'Fredrickson',
            aboutMe: 'I slap-pa da Bass',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Josh');
        expect(response.body.lastName).toEqual('Fredrickson');
        expect(response.body.aboutMe).toEqual('I slap-pa da Bass');
      });
  });
});

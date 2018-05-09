'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
import { pRemoveSongMock } from './lib/song-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveSongMock);

  test('POST /profiles should get a 200 if no errors and a song', () => {
    let accountMock = null;
    return pCreateAccountMock() // need to create an account before you can make a song...
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            bio: 'I am the mountain that rides',
            firstName: 'Gregor',
            lastName: 'Sanchez',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Gregor');
        expect(response.body.lastName).toEqual('Sanchez');
      });
  });
});

'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
import { pCreateSongMock, pRemoveSongMock } from './lib/song-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /songs', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveSongMock);

  test('POST /songs - should get a 200 if no errors and a song', () => {
    let accountMock = null;
    return pCreateAccountMock() // need to create an account before you can make a song...
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/songs`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            song: 'Trouble',
            artist: 'The Desperate',
            genre: 'Indie Rock',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.song).toEqual('Trouble');
        expect(response.body.artist).toEqual('The Desperate');
        expect(response.body.genre).toEqual('Indie Rock');
      });
  });

  test('GET /songs - the test should get a 200 if no errors and a song is returned', () => {
    return pCreateSongMock()
      .then((mock) => {
        return superagent.get(`${apiURL}/songs`)
          .auth(mock.request.username, mock.request.password);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
});

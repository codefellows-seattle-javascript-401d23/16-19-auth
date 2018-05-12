
'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
// import { pCreateProfileMock, pRemoveProfileMock} from './lib/profile-mock';
import { pRemoveProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveProfileMock);

  test('POST /profiles should get a 200 and the newly created profile', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            bio: 'I am a walrus',
            firstName: 'John',
            lastName: 'Lennon',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('John');
        expect(response.body.lastName).toEqual('Lennon');
        expect(response.body.bio).toEqual('I am a walrus');
      });
  });
  test('POST 400 due to lack of name', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        console.log(accountMock);
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            bio: 'I am a walrus',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
      });
  // test('GET /profiles:/id return profile by ID', () => {
  //   let profileMock = null;
  //   return pCreateProfileMock()
  //     .then(profileMock)
  //   profileMock = profile;
  //   return superagent.get(`${apiURL}/${profile._id}`);
  });
});

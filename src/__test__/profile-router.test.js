'use strict';

import superagent from 'superagent';
import faker from 'faker';

import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
import { pRemoveProfileMock, pCreateProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/profiles', () => {
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
        expect(response.body.bio).toEqual('I am the mountain that rides');
      });
  });

  test('POST /profiles should return a 400 status code', () => {
    const profileToPost = {
      bio: faker.lorem.words(10),
      firstName: faker.lorem.words(10),
      lastName: faker.lorem.words(10),
    };
    return superagent.post(`${apiURL}/profiles`)
      .send(profileToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('POST /profiles should return a 404 status code', () => {
    const profileToPost = {
      bio: faker.lorem.words(10),
      firstName: faker.lorem.words(10),
      lastName: faker.lorem.words(10),
    };
    return superagent.post(`${apiURL}/badRoute`)
      .send(profileToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
  test('GET /profiles/:id should respond with 200 if there are no errors', () => {
    let profileToTest = null;
    return pCreateProfileMock()
      .then((profile) => {
        profileToTest = profile;
        return superagent.get(`${apiURL}/profiles/${profile.profile._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.bio).toEqual(profileToTest.profile.bio);
        expect(response.body.firstName).toEqual(profileToTest.profile.firstName);
        expect(response.body.lastName).toEqual(profileToTest.profile.lastName);
        expect(response.body._id).toBeTruthy();
      });
  });
  test('GET /profile should return a 400 status code', () => {
    return pCreateProfileMock()
      .then(() => {
        return superagent.get(`${apiURL}/login`);
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('GET /profile should respond with 404 if there is no profile to be found', () => {
    return superagent.get(`${apiURL}/invalidId`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});

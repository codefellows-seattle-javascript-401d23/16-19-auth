'use strict';

import faker from 'faker';
import Profile from '../../model/profile';
import { pCreateAccountMock, pRemoveAccountMock } from './account-mock';

const pCreateProfileMock = () => {
  const resultMock = {};

  return pCreateAccountMock()
    .then((accountSetMock) => {
      resultMock.accountSetMock = accountSetMock;

      return new Profile({
        bio: faker.lorem.words(10),
        avatar: faker.random.image(),
        lastName: faker.name.lastName(),
        firstName: faker.name.firstName(),
        account: accountSetMock.account._id, // sets up the relationship
      }).save();
    })
    .then((profile) => {
      resultMock.profile = profile;
      return resultMock;
    });
};

const pRemoveProfileMock = () => {
  return Promise.all([ // takes an array of promises
    Profile.remove({}), // remove all of the profiles
    pRemoveAccountMock(), // remove all of the account mocks
  ]);
};

export { pCreateProfileMock, pRemoveProfileMock };


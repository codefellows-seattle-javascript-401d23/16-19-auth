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
        firstName: faker.name.firstName(),
        middleName: faker.name.lastName(),
        aboutMe: faker.lorem.words(16),
        myPic: faker.random.image(),
        account: accountSetMock.account._id,
      }).save();
    })
    .then((profile) => {
      resultMock.profile = profile;
      return resultMock;
    });
};

const pRemoveProfileMock = () => {
  return Promise.all([
    Profile.remove({}),
    pRemoveAccountMock(),
  ]);
};

export { pCreateProfileMock, pRemoveProfileMock };

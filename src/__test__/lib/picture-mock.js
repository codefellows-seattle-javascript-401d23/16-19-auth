'use strict';

import faker from 'faker';
import { pCreateAccountMock } from '../lib/account-mock';
import Picture from '../../model/picture';
import Account from '../../model/account';


const pCreatePictureMock = () => {
  const resultMock = {};
  return pCreateAccountMock()
    .then((mockAccountResponse) => {
      resultMock.accountMock = mockAccountResponse;

      return new Picture({
        title: faker.lorem.words(7),
        url: faker.random.image(),
        account: resultMock.accountMock.account._id,
      }).save();
    })
    .then((picture) => {
      resultMock.picture = picture;
      return resultMock;
    });
};


const pRemovePictureMock = () => Promise.all([Account.remove({}), Picture.remove({})]);

export { pCreatePictureMock, pRemovePictureMock };

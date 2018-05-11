'use strict';

import faker from 'faker';
import { pCreateAccountMock } from './account-mock'; // TODO: pRemoveAccountMock is defined but never used
import Image from '../../model/image'; //
import Account from '../../model/account'; //

const pCreateImageMock = () => {
  const resultMock = {};
  return pCreateAccountMock()
    .then((mockAcctResponse) => {
      resultMock.accountMock =
        mockAcctResponse;

      return new Image({
        url: faker.lorem.words(1),
        artist: faker.lorem.words(1),
        account: resultMock.accountMock.account._id,
      }).save();
    })
    .then((image) => {
      resultMock.image = image;
      return resultMock;
    });
};

const pRemoveImageMock = () => Promise.all([Account.remove({}), Image.remove({})]);

export { pCreateImageMock, pRemoveImageMock };

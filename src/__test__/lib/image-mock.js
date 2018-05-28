'use strict';

import faker from 'faker';
import { pCreateAccountMock, pRemoveAccountMock } from './account-mock'; /*eslint-disable-line*/
import Image from '../../model/image'; //
import Account from '../../model/account'; //

const pCreateImageMock = () => {
  const resultMock = {};
  return pCreateAccountMock()
    .then((mockAcctResponse) => {
      resultMock.accountMock = mockAcctResponse;

      return new Image({
        artist: faker.lorem.words(1),
        url: faker.random.words(1),
        genre: faker.random.words(1),
        camera: faker.random.words(1),
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

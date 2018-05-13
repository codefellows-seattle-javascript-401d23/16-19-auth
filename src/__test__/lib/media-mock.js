'use strict';

import faker from 'faker';
import { pCreateAccountMock } from './account-mock';
import Media from '../../model/media';
import Account from '../../model/account';

const pCreateMediaMock = () => {
  const resultMock = {};
  return pCreateAccountMock()
    .then((mockAcctResponse) => {
      resultMock.accountMock = mockAcctResponse;
      return new Media({
        title: faker.lorem.words(5),
        mediaType: faker.lorem.words(2),
        url: faker.random.image(),
        account: resultMock.accountMock.account._id,
      }).save();
    })
    .then((media) => {
      resultMock.media = media;
      return resultMock;
    });
};

const pRemoveMediaMock = () => Promise.all([Account.remove({}), Media.remove({})]);

export { pCreateMediaMock, pRemoveMediaMock };

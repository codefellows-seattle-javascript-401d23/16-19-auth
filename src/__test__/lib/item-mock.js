'use strick';

import faker from 'faker';
import { pCreateAccountMock } from './account-mock';
import Item from '../../model/item';
import Account from '../../model/account';

const pCreateItemMock = () => {
  const resultMock = {};
  return pCreateAccountMock()
    .then((mockAcctResponse) => {
      resultMock.accountMock = mockAcctResponse;

      return new Item({
        title: faker.lorem.words(5),
        url: faker.random.image(),
        account: resultMock.accountMock.account._id,
      }).save();
    })
    .then((item) => {
      resultMock.item = item;
      return resultMock;
    });
};

const pRemoveItemMock = () => Promise.all([Account.remove({}), Item.remove({})]);

export { pCreateItemMock, pRemoveItemMock };

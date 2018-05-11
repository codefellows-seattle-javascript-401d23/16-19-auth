'use strict';

import faker from 'faker';
import Account from '../../model/account';

const createAccountMock = () => {
  const mock = {};
  mock.request = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.lorem.words(5),
  };
  return Account.create(mock.request.username, mock.request.email, mock.request.password)
    .then((account) => {
      mock.account = account;
      console.log('account', account);
      return account.createToken(); // This line changes the token seed!
    })
    .then((token) => {
      console.log('token', token);
      mock.token = token;
      // here, I know that the account has changed (tokenSeed).
      return Account.findById(mock.account._id);
    })
    .then((account) => {
      mock.account = account;
      return mock;
    });
};

const removeAccountMock = () => Account.remove({});

export { createAccountMock, removeAccountMock };

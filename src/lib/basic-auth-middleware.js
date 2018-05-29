'use strict';

import HttpError from 'http-errors';
import Account from '../model/account';

export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  // if i'm here I have the right header
  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  // destructuring array
  const [username, password] = stringAuthHeader.split(':');

  if (!username || !password) {
    return next(new HttpError(400, '_AUTH - invalid request'));
  }
  // we have a username and a password
  return Account.findOne({ username })
    .then((account) => {
      if (!account) {
        throw new HttpError(400, 'AUTH - invalid request');
      }
      return account.pVerifyPassword(password);
    })
    .then((account) => {
      request.account = account;
      return next(); // this is calling the next function in the middleware chain
    })
    .catch(next);
};


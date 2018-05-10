'use strict';

import HttpError from 'http-errors';
import Account from '../model/account';

export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  // if I'm here, I know I have the header
  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'Auth - invalid request'));
  }

  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  // at this point stringAuthHeader looks like username:password
  // destructuring an array below...ES6 cool feature!
  const [username, password] = stringAuthHeader.split(':');

  if (!username || !password) {
    return next(new HttpError(400, 'Auth - invalid request'));
  }

  // we know we have a username and password now...
  return Account.findOne({ username })
    .then((account) => {
      if (!account) {
        return next(new HttpError(404, 'Auth ERROR not found'));
      }
      return account.pVerifyPassword(password);
    })
    .then((account) => {
      request.account = account;
      return next(); // this calls the next function in the middleware chain.
    })
    .catch(next);
};

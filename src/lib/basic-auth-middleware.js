'use strict';

import HttpError from 'http-errors';
import Account from '../model/account';
import { verifyPassword } from '../model/account';

export default (request, response, next) => {
  // check request.headers.authorization contains username and password
  // parse username and password from base 64 to string split on ':'
  // find the account, and then login 
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'Authorization invalid request'));
  }
  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'Authorization invalid request error 2'));
  }
  // convert from base 64 to string is username:password
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  const usernamePassword = stringAuthHeader.split(':');
  // or const [username, password] = stringAuthHeader.split(':'); assigns local variables to those array values
  if (!username || !password) {
    return next(new HttpError(400, 'Authorization invalid request error 3'));
  }
  return Account.findOne({ username })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'Authorization invalid request error 4'));
      }
      return Account.verifyPassword(password);
    })
    .then((account) => {
      request.account = account;
      return next(); // calls next function in middleware
    })
    .catch(next);
};

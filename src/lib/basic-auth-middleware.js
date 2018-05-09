'use strict';

import HttpError from 'http-errors';
import Account from '../model/account';

// middleware is still a chainlink so it requires the request, response, and next args.
export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request.'));
  }
  // Here means I have the header.
  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'AUTH - invalid request.'));
  }
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  // at this point, this variable looks like "username:password"
  const [username, password] = stringAuthHeader.split(':');
  // previous line is considered destructuring.
  if (!username || !password) {
    return next(new HttpError(400, 'AUTH - invalid request.'));    
  }
  // We now have a username and password
  return Account.findOne({ username })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'AUTH - invalid request.'));      
      }
      return account.verifyPassword(password);
    })
    .then((account) => {
      // in this line, I have the correct account.
      request.account = account;
      return next();
    })
    .catch(next);
};

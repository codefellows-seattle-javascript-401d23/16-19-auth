'use strict';

import HttpError from 'http-errors';
import jsonWebToken from 'jsonwebtoken';
import Account from '../model/account';

// TODO: wrapping
const promisify = fn => (...args) => {
  return new Promise((result, reject) => {
    fn(...args, (error, data) => {
      if (error) {
        return reject(error); // goes to the next catch
      }
      return result(data); // goes to the next .then
    });
  });
};

export default (request, response, next) => {
  console.log(request.headers.authorization, 'inside of bearer-auth-middleware');
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'Auth - __ERROR__ authorization header required'));
  }

  const token = request.headers.authorization.split('Bearer ')[1];

  if (!token) {
    return next(new HttpError(400, 'Auth - __ERROR__ token required'));
  }

  return promisify(jsonWebToken.verify)(token, process.env.THE_DESPERATE_SECRET)
    .catch(error => Promise.reject(new HttpError(401, error)))
    .then((decryptedToken) => {
      return Account.findOne({ tokenSeed: decryptedToken.tokenSeed });
    })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'Auth - __ERROR__ not found'));
      }
      request.account = account;
      return next();
    })
    .catch(next);
};

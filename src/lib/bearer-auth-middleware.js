'use strict';

import HttpError from 'http-errors';
import jsonWebToken from 'jsonwebtoken';
import Account from '../model/account';

const promisify = callbackStyleFunction => (...args) => {
  return new Promise((resolve, reject) => {
    callbackStyleFunction(...args, (error, data) => {
      if (error) {
        return reject(error); // will hit the next .catch
      }
      return resolve(data); // will hit the next .then
    });
  });
};

export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, '__ERROR__ authorization header required'));
  }

  const token = request.headers.authorization.split('Bearer ')[1];

  if (!token) {
    return next(new HttpError(400, '__ERROR__ token required'));
  }

  return promisify(jsonWebToken.verify)(token, process.env.PHOTO_BOMB_SECRET)
    .catch((error) => {
      return Promise.reject(new HttpError(400, `AUTH - jsonWebToken Error ${error}`));
    })
    .then((decryptedToken) => {
      return Account.findOne({ tokenSeed: decryptedToken.tokenSeed });
    })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'AUTH - invalid request'));
      }
      request.account = account;
      return next();
    })
    .catch(next);
};


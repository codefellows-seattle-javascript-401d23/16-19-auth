'use strict';

import HttpError from 'http-errors';
import jsonWebToken from 'jsonwebtoken';
import Account from '../model/account';

const promisify = callbackStyleFunction => (...args) => {
  // I have 2 sets of arguments
  // fn => the function we want to promisify
  // the set of args of the original function.
  return new Promise((resolve, reject) => {
    callbackStyleFunction(...args, (error, data) => {
      if (error) {
        return reject(error); // goes to the next .catch()
      }
      return resolve(data); // going to the next .then()
    });
  });
};

export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  const token = request.headers.authorization.split('Bearer ')[1];

  if (!token) {
    return next(new HttpError(400, 'AUTH - invalid request'));    
  }

  return promisify(jsonWebToken.verify)(token, process.env.IMAGE_UPLOAD_SECRET)
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

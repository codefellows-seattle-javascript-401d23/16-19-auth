'use strict';

import HttpError from 'http-errors';
import jsonWebToken from 'jsonwebtoken';
import Account from '../model/account';

const promisify = callbackStyleFunction => (...args) => {
  // Here, I have 2 sets of arguments
  // fn -> the function we want to promisify
  // the set of arguments of the original function
  // console.log('hound' 'is', 'cute');
  return new Promise((result, reject) => {
    console.log(result, 'inside promise line 13');
    callbackStyleFunction(...args, (error, data) => {
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
    return next(new HttpError(400, 'Auth - invalid request'));
  }

  const token = request.headers.authorization.split('Bearer ')[1];

  if (!token) {
    return next(new HttpError(400, 'Auth - invalid request'));
  }

  return promisify(jsonWebToken.verify)(token, process.env.THE_DESPERATE_SECRET)
    .catch((error) => {
      return Promise.reject(new HttpError(400, `AUTH - jsonWebToken Error ${error}`));
    })
    .then((decryptedToken) => {
      return Account.findOne({ tokenSeed: decryptedToken.tokenSeed });
    })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'Auth - invalid request'));
      }
      request.account = account;
      return next();
    })
    .catch(next);
};

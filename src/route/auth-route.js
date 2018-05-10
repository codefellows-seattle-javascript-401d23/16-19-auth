'use strict';

import { json } from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Account from '../model/account';
import basicAuthMiddleware from '../lib/basic-auth-middleware';
import logger from '../lib/logger';

const authRoute = new Router();
const jsonParser = json();

authRoute.post('/login', jsonParser, (request, response, next) => {
  if (!Account) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  return Account.create(request.body.username, request.body.email, request.body.password)
    .then((account) => {
      delete request.body.password;
      logger.log(logger.INFO, 'AUTH - creating TOKEN');
      return account.pCreateToken();
    })
    .then((token) => {
      logger.log(logger.INFO, 'AUTH - returning a 200 code and a token');
      return response.json({ token });
    })
    .catch(next);
});

authRoute.get('/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'AUTH - invalid request'));
  }
  return request.account.pCreateToken()
    .then((token) => {
      logger.log(logger.INFO, 'Login - responding with a 200 status and a Token');
      return response.json({ token });
    })
    .catch(next);
});


export default authRoute;

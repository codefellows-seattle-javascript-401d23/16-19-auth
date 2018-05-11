'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import Account from '../model/account';
import logger from '../lib/logger';
import basicAuthMiddleWare from '../lib/basic-auth-middleware';

const authRouter = new Router();
const jsonParser = json();

authRouter.post('/signup', jsonParser, (request, response, next) => {
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

authRouter.get('/login', basicAuthMiddleWare, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, '_ERROR_ not found'));
  }

  return request.account.createToken()
    .then(token => response.json({ token }))
    .catch(next);
});

export default authRouter;

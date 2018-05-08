'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import Profile from '../model/profile';
import logger from '../lib/logger';
// import basicAuthMiddleware from '../lib/basic-auth-middleware';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';

const profileRouter = new Router();
const jsonParser = json();

profileRouter.post('/profiles', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  return new Profile({
    ...request.body,
    account: request.account._id,
  })
    .save()
    .then((profile) => {
      // console.log(response.json(profile), 'this is the profile');
      logger.log(logger.INFO, 'Returning a 200 and a new Profile');
      
      return response.json(profile);
    })
    .catch(next);
});

export default profileRouter;

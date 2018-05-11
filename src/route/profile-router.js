'use strict';

import { json } from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Profile from '../model/profile';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';

const jsonParser = json();
const profileRouter = new Router();

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
      logger.log(logger.INFO, 'Returning a 200 and a new Profile');
      return response.json(profile);
    })
    .catch(next);
});

profileRouter.get('/profiles/:id', (request, response, next) => {
  return Profile.findById(request.params.id)
    .then((profile) => {
      if (!profile) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!profile)');
        return next(new HttpError(404, 'region not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(profile);
    })
    .catch(next);
});

export default profileRouter;

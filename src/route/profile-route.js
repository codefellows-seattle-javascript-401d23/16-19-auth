'use strict';

import { Router } from 'express';
import HttpError from 'http-errors';
import bodyParser from 'body-parser';
import Profile from '../model/profile';
import logger from '../lib/logger';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';


const jsonParser = bodyParser.json();
const profileRouter = new Router();

profileRouter.post('/profiles', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'AUTH  in POST- profile route invalid req!'));
  }
  return new Profile({
    ...request.body,
    account: request.account._id,
  })
    .save()
    .then((profile) => {
      logger.log(logger.INFO, '200 from new Profile created!');
      return response.json(profile);
    })
    .catch(next);
});

profileRouter.get('/profiles/:id', (request, response, next) => {
  // if (!request.params._id) {
  //   console.log('WHAT REQ.params', request.params);
  //   return next(new HttpError(400, 'AUTH in GET - no id!'));
  // }
  return Profile.findById(request.params.id)
    .then((profile) => {
      if (!profile) {
        // stuff 
      }
      logger.log(logger.INFO, '200 in profile, GET route!');
      return response.json(profile);
    })
    .catch(next);
});

// ...request.body will destructure all the properties! then request.account, grabs the property it wants

export default profileRouter;

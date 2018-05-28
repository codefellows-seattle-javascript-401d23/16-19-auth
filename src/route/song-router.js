'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import Song from '../model/song';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';


const jsonParser = bodyParser.json();

const songRouter = new Router();

songRouter.post('/songs', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'ERROR - not found'));
  }

  return new Song({
    ...request.body,
    account: request.account._id,
  }).save()
    .then(song => response.json(song))
    .catch(next);
});

songRouter.get('/songs', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'Auth - Invalid request'));
  }

  return request.song.pCreateToken()
    .then((token) => {
      logger.log(logger.INFO, 'Getting a song');
      return response.json({ token });
    });
});

export default songRouter;

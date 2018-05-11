'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import bearerAuthMiddleWare from '../lib/bearer-auth-middleware';
import Sound from '../model/sound';
import { s3Upload, s3Remove } from '../lib/s3';

const multerUpload = multer({ dest: `${__dirname}/../temp` });

const soundRouter = new Router();

soundRouter.post('/sounds', bearerAuthMiddleWare, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'SOUND ROUTER _ERROR_, not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'sound') {
    return next(new HttpError(400, 'SOUND ROUTER __ERROR__ invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  return s3Upload(file.path, key)
    .then((url) => {
      return new Sound({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save();
    })
    .then(sound => response.json(sound))
    .catch(next);
});

soundRouter.get('/sounds/:id', bearerAuthMiddleWare, (request, response, next) => {
  return Sound.findById(request.params.id)
    .then((sound) => {
      if (!sound) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!sound)');
        return next(new HttpError(404, 'sound not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(sound);
    })
    .catch(next);
});

export default soundRouter;

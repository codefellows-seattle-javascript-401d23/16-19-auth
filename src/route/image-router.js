'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import bearerAuthMiddleWare from '../lib/bearer-auth-middleware';
import Image from '../model/image';
import { s3Upload, s3Remove } from '../lib/s3';

const multerUpload = multer({ dest: `${__dirname}/../temp` });

const imageRouter = new Router();

imageRouter.post('/images', bearerAuthMiddleWare, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'IMAGE ROUTER _ERROR_, not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'image') {
    return next(new HttpError(400, 'IMAGE ROUTER __ERROR__ invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  return s3Upload(file.path, key)
    .then((url) => {
      return new Image({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save();
    })
    .then(image => response.json(image))
    .catch(next);
});

imageRouter.get('/images/:id', bearerAuthMiddleWare, (request, response, next) => {
  return Image.findById(request.params.id)
    .then((image) => {
      if (!image) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!image)');
        return next(new HttpError(404, 'image not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(image);
    })
    .catch(next);
});

imageRouter.delete('/images/:id', bearerAuthMiddleWare, (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpError(404, 'IMAGE ROUTER DELETE ERROR: no params id'));
  }
  return Image.findByIdAndRemove(request.params.id)
    .then((image) => {
      if (!image) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!image)');
        return next(new HttpError(404, 'image not found'));
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      return s3Remove(image.url);
    })
    .then(() => {
      return response.sendStatus(204);
    })
    .catch(next);
});

export default imageRouter;

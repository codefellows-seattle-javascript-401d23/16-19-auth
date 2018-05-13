'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import Media from '../model/media';
import { s3Upload } from '../lib/s3';

const multerUpload = multer({ dest: `${__dirname}/../temp` });

const mediaRouter = new Router();

mediaRouter.post('/media', bearerAuthMiddleware, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'MEDIA ROUTER ERROR, not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'media') {
    return next(new HttpError(400, 'MEDIA ROUTER ERROR, invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  return s3Upload(file.path, key)
    .then((awsUrl) => {
      return new Media({
        title: request.body.title,
        account: request.account._id,
        mediaType: request.body.mediaType,
        url: awsUrl,
      }).save();
    })
    .then(media => response.json(media));
});

export default mediaRouter;

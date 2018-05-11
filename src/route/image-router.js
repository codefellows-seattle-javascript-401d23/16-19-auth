'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import bearerAuthMiddleWare from '../lib/bearer-auth-middleware';
import Image from '../model/image';
import { s3Upload, s3Get, s3Remove } from '../lib/s3';

const multerUpload = multer({ dest: `${__dirname}/../temp` });

const imageRouter = new Router();

imageRouter.post('/images', bearerAuthMiddleWare, multerUpload.any(), (request, response, next) => {
  console.log(request, 'beginning of route');
  if (!request.account) {
    return next(new HttpError(404, 'IMAGE ROUTER _ERROR_, not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'image') {
    return next(new HttpError(400, 'IMAGE ROUTER __ERROR__ invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  console.log('before upload in route');

  return s3Upload(file.path, key)
    .then((url) => {
      console.log('in .then of upload in route');
      return new Image({
        artist: request.body.artist,
        account: request.account._id,
        url,
      }).save();
    })
    .then(image => response.json(image))
    .catch(next);
});

imageRouter.get('/images', bearerAuthMiddleWare, (request, response, next) => {
  if (!request.account._id) {
    return next(new HttpError(400, 'IMAGE ROUTER _ERROR_, invalid request line 44'));
  }

  return s3Get(key)
    .then((url) => {
      console.log('in .then on the GET route');
      return request.song.pCreateToken()
        .then((token) => {
          return response.json({ token });
        });
    });
});

imageRouter.delete('/images', )

export default imageRouter;


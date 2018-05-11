'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import bearerAuthMiddleWare from '../lib/bearer-auth-middleware';
import Item from '../model/item';
import { s3Upload, s3Remove } from '../lib/s3';  // eslint-disable-line

const multerUpload = multer({ dest: `${__dirname}/../temp` });
const itemRouter = new Router();

itemRouter.post('/item', bearerAuthMiddleWare, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'ITEM ROUTER __ERROR__ invalied request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  return s3Upload(file.path, key)
    .then((url) => {
      return new Item({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save();
    })
    .then(sound => response.json(sound))
    .catch(next);
});

export default itemRouter;

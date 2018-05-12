'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import bearerAuthMiddleWare from '../lib/bearer-auth-middleware';
import Picture from '../model/picture';
import { s3Upload, s3Remove } from '../lib/s3'; 

const multerUpload = multer({ dest: `${__dirname}/../temp` });

const pictureRouter = new Router();

pictureRouter.post('/pictures', bearerAuthMiddleWare, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'PICTURE ROUTER _ERROR_, not found'));
  }

  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'picture') {
    return next(new HttpError(400, 'PICTURE ROUTER __ERROR__ invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  return s3Upload(file.path, key)
    .then((awsUrl) => {
      return new Picture({
        title: request.body.title,
        account: request.account._id,
        url: awsUrl,
      }).save();
    })
    .then(picture => response.json(picture))
    .catch(next);
});

// write a get route here 
pictureRouter.get('/pictures/:id', bearerAuthMiddleWare, (request, response, next) => {
  getdatabase.findById();
});

// write a delete route here (utilizing the s3Remove method to target an ID)
pictureRouter.delete('/pictures/:id', bearerAuthMiddleWare, (request, response, next) => {
  
});

export default pictureRouter;

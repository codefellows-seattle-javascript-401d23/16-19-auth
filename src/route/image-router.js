'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import bearerAuthMiddleWare from '../lib/bearer-auth-middleware';
import Image from '../model/image';
import { s3Upload, s3Get, s3Remove } from '../lib/s3';

const multerUpload = multer({ dest: `${__dirname}/temp` });

const imageRouter = new Router();

imageRouter.post('/images', bearerAuthMiddleWare, multerUpload.any(), (request, response, next) => {
  console.log(request.account, 'hello there'); // the image is not attached to the account yet...
  if (!request.account) { // TODO: Why is account not resolved???
    return next(new HttpError(404, 'IMAGE ROUTER _ERROR_, not found'));
  }
  console.log(request.body, 'hello there'); // the image mock is created by the time we get to  this line...
  // TODO:  why is files unresolved???
  if (!request.body || request.files.length > 1 || request.files[0].fieldname !== 'image') {
    return next(new HttpError(400, 'IMAGE ROUTER __ERROR__ invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  return s3Upload(file.path, key)
    .then((url) => {
      // console.log('in .then of upload in route');
      return new Image({
        artist: request.body.artist,
        account: request.account._id,
        url,
      }).save();
    })
    .then(image => response.json(image))
    .catch(next);
});

imageRouter.get('/images/:id', bearerAuthMiddleWare, (request, response, next) => {
  if (!request.account._id) {
    console.log(!request.account._id, 'inside the GET route...');
    return next(new HttpError(400, 'IMAGE ROUTER _ERROR_, invalid request line 44'));
  }
  console.log(response, 'in the GET');
  return request;
  // return Image.findById(request.params.id)
  //   // .then((image) => {
  //   //   console.log('in .then on the GET route');
  //   //   return response.json(image);
  //   // });
});

imageRouter.delete('/images');

export default imageRouter;

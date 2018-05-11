'use strict';

import { json } from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Profile from '../model/profile';
import bearerAuthMiddleware from '../lib/bearer-auth.middleware';
import logger from '../lib/logger';

const jsonParser=json();
const profileRouter=new Router();

profileRouter.post('/profiles',bearerAuthMiddleware,jsonParser,(request,response,next)=>{
    if(!request.account){
        return next(new HttpError(400,'AUTH-request invalid, incorrect account'));
    }
    return new Profile({
        ...request.body,
        account: request.account._id,
    })
    .save()
    .then((profile)=>{
        logger.log(logger.INFO,'Returns a new profile and a 200 code');
        return response.json(profile);
    })
    .catch(next);
});
export default profileRouter;
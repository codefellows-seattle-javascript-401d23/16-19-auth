'use strict';

import {json} from 'body-parser';
import {Router} from 'express';
import HttpError from 'http-errors';
import Account from '../mode/account';
import basicAuthMiddleware from '../lib/basic-auth-middleware';
import logger from '../logger';

const authRouter=new Router();
const jsonParser=json();

authRouter.post('/signup',jsonParser,(request,response,next=>{
    return Account.create(request.body.username,request.body.email,request.body.password)
    .then((account)=>{
        delete request.body.password;
        logger.log(logger.INFO,'AUTH-TOKEN CREATION');
        return account.pCreateToken();
    })
    .then((token)=>{
        logger.log(logger.INFO,'AUTH-returning token and 200 code.');
        return response.json({ token });
    })
    .catch(next);
}));

export default authRouter;
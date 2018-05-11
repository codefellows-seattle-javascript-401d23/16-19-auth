'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock, pRemoveAccountMock } from './lib/account-mock';

const apiURL= `http://localhost:${process.env.PORT}`;

describe ('AUTH Router', ()=>{
    beforeAl(startServer);
    afterAll(stopServer);
    afterEAch(pRemoveAccountMock);

    rest('POST returns 200 and token', ()=>{
        return superagent.post(`${apiURL}/signup`)
        .send({
            username:'HighSierra',
            password:'Elite',
            email:'SuspensionStrap@gmail.com'
        })
        .then((response)=>{
            expect(response.status).toEqual(200);
            exppect(response.body.token).toBeTruthy();
        });
    });
    descibe('GET /login',() => {
        test ('GET login should return a 200 and a token', () =>{
            return pCreateAccountMock()
            .then((mock)=>{
                return superagent.get(`${apiURL}/login`)
                .auth(mock.request.username,mock.request.password);
            })
            .then((response)=>{
                expect(response.status.toEqual(200));
                expect(response.body.token).toBeTruthy();
            });
        });
    });
});
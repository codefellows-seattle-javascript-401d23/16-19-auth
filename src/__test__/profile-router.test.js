'use strict';

import superagent from 'superagent';

import { startServer,stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
import { pRemoveProfileMock } from './lib/profile-mock';

const apiUrl=`http://localhost:${process.env.PORT}`;

describe ('POST /profiles', ()=>{
    beforeAll(startServer);
    afterAll(stopServer);
    afterEach(pRemoveProfileMock);
    test('POST /profiles should return a 200 and the new profile data', () =>{
        let accountMock=null;
        return pCreateAccountMock()
        .then((accountSetMock)=>{
            accountMock=accountSetMock;
            return superagent.post(`${apiURL}/profiles`)
            .set('Authorization',`Bearer ${accountSetMock.token}`)
            .send({
                bio: 'yurop',
                firstName: 'uhh mare ih cuhz',
                lastName: 'ay sha',
            });
        })
        .then((response)=>{
            expect(response.status).toEqual(200);
            expect(response.body.account).toEqual(accountMock.account._id.toString());
            expect(response.body.firstName).toEqual('uhh mare ih cuhz');
            expect(response.body.lastName).toEqual('ay sha');
            expect(response.body.bio).toEqual('yurop');
        });
    });
});
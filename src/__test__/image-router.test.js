'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createImageMock, removeImageMock } from './lib/image-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES At /images', () => {
  beforeAll(startServer);
  afterEach(removeImageMock);
  afterAll(stopServer);

  describe('POST /images', () => {
    describe('POST 200 for successful post to /images', () => {
      test('should return 200', () => {
        // only do the following line if you have a slow computer.
        jest.setTimeout(10000);
        return createImageMock()
          .then((mockResponse) => {
            console.log('mockresponse', mockResponse);
            const { token } = mockResponse.accountMock;
            return superagent.post(`${apiURL}/images`)
              .set('Authorization', `Bearer ${token}`)
              .field('title', 'doggo')
              .attach('image', `${__dirname}/assets/dog.jpg`)
              .then((response) => {
                expect(response.status).toEqual(200);
                expect(response.body.title).toEqual('doggo');
                expect(response.body._id).toBeTruthy();
                expect(response.body.url).toBeTruthy();
              });
          })
          .catch((error) => {
            console.log(error);
            expect(error.status).toEqual(200);
          });
      });
    });
  });
});

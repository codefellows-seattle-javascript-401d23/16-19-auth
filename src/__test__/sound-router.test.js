'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveSoundMock, pCreateSoundMock } from './lib/sound-mock';
import logger from '../lib/logger';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /sounds', () => {
  beforeAll(startServer);
  afterEach(pRemoveSoundMock);
  afterAll(stopServer);

  describe('POST 200 for successful post /sounds', () => {
    test('should return 200 for sucessful sound post', () => {
      return pCreateSoundMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiUrl}/sounds`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'woman sings')
            .attach('sound', `${__dirname}/asset/soprano.wav`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('woman sings');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          expect(err.status).toEqual(200);
        });
    });
    test('POST /sounds should return a 400 status code', () => {
      const soundToPost = {
        title: faker.lorem.words(10),
        url: faker.random.image(),
      };
      return superagent.post(`${apiUrl}/sounds`)
        .send(soundToPost)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
    test('POST /sounds should return a 401 status code for no token', () => {
      return pCreateSoundMock()
        .then(() => {
          return superagent.post(`${apiUrl}/sounds`)
            .set('Authorization', 'Bearer ')
            .field('title', 'titletest')
            .attach('sound', `${__dirname}/asset/soprano.wav`)
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(401);
            });
        });
    });
    test('GET /sounds should get a 200 status code and a TOKEN', () => {
      return pCreateSoundMock()
        .then((mock) => {
          return superagent.get(`${apiUrl}/sounds/:id`)
            .auth(mock.request.username, mock.request.password);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        })
        .catch((error) => {
          logger.log(logger.ERR, error);
        });
    });
  });
  test('GET  /sounds should respond with 401 for no token', () => {
    return pCreateSoundMock()
      .then(() => {
        return superagent.post(`${apiUrl}/sounds`)
          .set('Authorization', 'Bearer ')
          .field('title', 'titletest')
          .attach('sound', `${__dirname}/asset/soprano.wav`)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(401);
          });
      });
  });
  test('GET /sounds should respond with 404 for wrong ID or no resource', () => {
    return superagent.get(`${apiUrl}/sounds`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
  test('DELETE /sounds should respond with a 204 upon successful deletion', () => {
    let testMock = null;
    return pCreateSoundMock()
      .then((mockResponse) => {
        testMock = mockResponse.sound;
        const { token } = mockResponse.accountMock;
        return superagent.delete(`${apiUrl}/sounds/${testMock._id}`)
          .set('Authorization', `Bearer ${token}`)
          .then((response) => {
            expect(response.status).toEqual(204);
          });
      });
  });
  test('DELETE /sounds should respond with a 401 for no token', () => {
    let testMock = null;
    return pCreateSoundMock()
      .then((mockResponse) => {
        testMock = mockResponse.sound;
        return superagent.delete(`${apiUrl}/sounds/${testMock._id}`)
          .set('Authorization', 'Bearer ')
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(401);
          });
      });
  });
  test('DELETE /sound  404 for wrong ID or no resource', () => {
    return pCreateSoundMock()
      .then(() => {
        return superagent.delete(`${apiUrl}/sounds`)
          .set('Authorization', 'Bearer ')
          .field('title', 'title')
          .attach('sound', `${__dirname}/asset/soprano.wav`)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
  });
});

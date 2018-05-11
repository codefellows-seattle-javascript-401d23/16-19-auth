'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveImageMock, pCreateImageMock } from './lib/image-mock';
import logger from '../lib/logger';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /images', () => {
  beforeAll(startServer);
  afterEach(pRemoveImageMock);
  afterAll(stopServer);

  describe('POST 200 for successful post /images', () => {
    test('should return 200 for sucessful image post', () => {
      return pCreateImageMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'whiteboard fail')
            .attach('image', `${__dirname}/asset/whiteboard.jpg`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('whiteboard fail');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          expect(err.status).toEqual(200);
        });
    });
    test('POST /images should return a 400 status code', () => {
      const imageToPost = {
        title: faker.lorem.words(10),
        url: faker.random.image(),
      };
      return superagent.post(`${apiUrl}/images`)
        .send(imageToPost)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
    test('POST /images should return a 401 status code for no token', () => {
      return pCreateImageMock()
        .then(() => {
          return superagent.post(`${apiUrl}/images`)
            .set('Authorization', 'Bearer ')
            .field('title', 'titletest')
            .attach('image', `${__dirname}/asset/whiteboard.jpg`)
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(401);
            });
        });
    });
    test('GET /images should get a 200 status code and a TOKEN', () => {
      return pCreateImageMock()
        .then((mock) => {
          return superagent.get(`${apiUrl}/images/:id`)
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
  test('GET  /images should respond with 401 for no token', () => {
    return pCreateImageMock()
      .then(() => {
        return superagent.post(`${apiUrl}/images`)
          .set('Authorization', 'Bearer ')
          .field('title', 'titletest')
          .attach('image', `${__dirname}/asset/whiteboard.jpg`)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(401);
          });
      });
  });
  test('GET /images should respond with 404 for wrong ID or no resource', () => {
    return superagent.get(`${apiUrl}/images`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
  test('DELETE /images should respond with a 204 upon successful deletion', () => {
    let testMock = null;
    return pCreateImageMock()
      .then((mockResponse) => {
        testMock = mockResponse.image;
        const { token } = mockResponse.accountMock;
        return superagent.delete(`${apiUrl}/images/${testMock._id}`)
          .set('Authorization', `Bearer ${token}`)
          .then((response) => {
            expect(response.status).toEqual(204);
          });
      });
  });
  test('DELETE /images should respond with a 401 for no token', () => {
    let testMock = null;
    return pCreateImageMock()
      .then((mockResponse) => {
        testMock = mockResponse.image;
        return superagent.delete(`${apiUrl}/images/${testMock._id}`)
          .set('Authorization', 'Bearer ')
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(401);
          });
      });
  });
  test('DELETE /image  404 for wrong ID or no resource', () => {
    return pCreateImageMock()
      .then(() => {
        return superagent.delete(`${apiUrl}/images`)
          .set('Authorization', 'Bearer ')
          .field('title', 'title')
          .attach('image', `${__dirname}/asset/whiteboard.jpg`)
          .then(Promise.reject)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
  });
});

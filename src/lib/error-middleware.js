'use strict';

import logger from './logger';

export default (error, request, response, next) => { // eslint-disable-line no-unused-vars
  logger.log(logger.ERROR, '__ERROR_MIDDLEWARE__');
  logger.log(logger.ERROR, error);

  if (error.status) {
    logger.log(logger.INFO, `ERROR MIDDLEWARE 1: Responding with a ${error.status} code and message ${error.message}`);
    return response.sendStatus(error.status);
  }
  // checking for non-HTTP type errors....
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('objectid failed')) {
    logger.log(logger.INFO, 'ERROR MIDDLEWARE 2: Responding with a error 404 code');
    return response.sendStatus(404);
  }

  if (errorMessage.includes('validation failed')) {
    logger.log(logger.INFO, 'ERROR MIDDLEWARE 3: Responding with an error 400 code');
    return response.sendStatus(400);
  }

  if (errorMessage.includes('duplicate key')) {
    logger.log(logger.INFO, 'ERROR MIDDLEWARE 4: Responding with an error 409 code');
    return response.sendStatus(409);
  }

  if (errorMessage.includes('unauthorized')) {
    logger.log(logger.INFO, 'ERROR MIDDLEWARE 5: Responding with an error 401 code');
    return response.sendStatus(401);
  }

  logger.log(logger.ERROR, 'ERROR MIDDLEWARE 6: Responding with a 500 error code');
  return response.sendStatus(500);
};

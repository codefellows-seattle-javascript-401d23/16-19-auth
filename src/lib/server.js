'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import authRoutes from '../route/router';
import errorMiddleware from './error-middleware';
import loggerMiddleware from './logger-middleware';
import pictureRoutes from '../route/picture-router';
import profileRoutes from '../route/profile-router';

const app = express();
let server = null;
//---------------------------------------------------------------------------------
// (1) link in the chain
app.use(loggerMiddleware); // middleware
app.use(authRoutes);
app.use(profileRoutes);
app.use(pictureRoutes);
//---------------------------------------------------------------------------------
// (2) link in the chain
app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});
//---------------------------------------------------------------------------------
// (3) link in the chain
app.use(errorMiddleware);
//---------------------------------------------------------------------------------

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    });
};

export { startServer, stopServer };

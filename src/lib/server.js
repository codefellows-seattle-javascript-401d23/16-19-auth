'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import authRouter from '../route/auth-route';
import songRouter from '../route/song-router';
import loggerMiddleware from './logger-middleware';
import errorMiddleware from './error-middleware';
import imageRouter from '../route/image-router';

const app = express();
let server = null;
// (1) first middleware
app.use(loggerMiddleware); // Mike: you removed the logger.log's from the routes
// (2) then this one...
app.use(authRouter);
app.use(songRouter);
app.use(imageRouter);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'SERVER: Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});
// (3) Mike: this runs when .next in cofferRouter
app.use(errorMiddleware);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      // mongoose is now connected
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `SERVER: listening on PORT ${process.env.PORT}`);
      });
      return undefined;
    })
    .catch((error) => {
      logger.log(logger.ERROR, `SERVER: something wrong with the server, ${JSON.stringify(error)}`);
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      return server.close(() => {
        logger.log(logger.INFO, 'SERVER:  Server is off');
      });
    })
    .catch((error) => {
      return logger.log(logger.ERROR, `SERVER: something wrong, server won't turn off ${JSON.stringify(error)} `);
    });
};

export { startServer, stopServer };

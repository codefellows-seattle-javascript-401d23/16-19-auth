'use strict';

import fs from 'fs-extra';
import logger from './logger';

const s3Upload = (path, key) => {
  const AWS = require('aws-sdk');
  const amazonS3 = new AWS.S3();

  const uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path),
  };

  return amazonS3.upload(uploadOptions)
    .promise()
    .then((response) => {
      return fs.remove(path)
        .then(() => response.Location)
        .catch(err => Promise.reject(err));
    })
    .catch((err) => {
      return fs.remove(path)
        .then(() => Promise.reject(err))
        .catch(fsErr => Promise.reject(fsErr));
    });
};

const s3Remove = (key) => {
  const AWS = require('aws-sdk');
  const amazonS3 = new AWS.S3();
  const removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };

  return amazonS3.deleteObject(removeOptions)
    .promise()
    .then(() => {
      logger.log(logger.INFO, 'SUCCESS');
    })
    .catch((err) => {
      Promise.reject(err);
    });
};

export { s3Upload, s3Remove };

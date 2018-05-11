'use strict';

import fs from 'fs-extra';

const s3Upload = (path, key) => {
  const AWS = require('aws-sdk');
  const amazonS3 = new AWS.S3();

  const uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path), // creates a readable stream
  };

  return amazonS3.upload(uploadOptions)
    .promise() // this little cased promise calls the internal call back of the .upload()
    .then((response) => {
    // console.log('response from S3', response);
      return fs.remove(path)
        .then(() => response.Location)
        .catch(error => Promise.reject(error));
    })
    .catch((error) => {
      return fs.remove(path)
        .then(() => Promise.reject(error))
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

  return amazonS3.deleteObject(removeOptions).promise();
};

export { s3Upload, s3Remove };

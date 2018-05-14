'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3Remove = exports.s3Get = exports.s3Upload = undefined;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var s3Upload = function s3Upload(path, key) {
  var aws = require('aws-sdk');
  var amazonS3 = new aws.S3();
  var uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: _fsExtra2.default.createReadStream(path)
  };

  return amazonS3.upload(uploadOptions).promise() // this calls the internal callback of the .upload method
  .then(function (response) {
    console.log(response, 'response from s3');
    return _fsExtra2.default.remove(path).then(function () {
      return response.Location;
    }).catch(function (err) {
      return Promise.reject(err);
    });
  }).catch(function (err) {
    return _fsExtra2.default.remove(path).then(function () {
      return Promise.reject(err);
    }).catch(function (fsErr) {
      return Promise.reject(fsErr);
    });
  });
};

// TODO: Turns out I didn't need this but keeping it in case I want to add future functionality.
var s3Get = function s3Get(key) {
  var aws = require('aws-sdk');
  var amazonS3 = new aws.S3();
  var getOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key
  };

  return amazonS3.getObject(getOptions).promise().then(function (data) {
    // console.log(data, 'SUCCESSFUL GET OBJECT FROM S3 BUCKET');
  }).catch(function (err) {
    Promise.reject(err);
  });
};

var s3Remove = function s3Remove(key) {
  var aws = require('aws-sdk');
  var amazonS3 = new aws.S3();
  var removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET
  };

  return amazonS3.deleteObject(removeOptions) // TODO: this could be an issue...
  .promise().then(function (data) {
    console.log(data, 'SUCCESSFUL DELETION');
  }).catch(function (err) {
    Promise.reject(err);
  });
};

exports.s3Upload = s3Upload;
exports.s3Get = s3Get;
exports.s3Remove = s3Remove;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pRemovePictureMock = exports.pCreatePictureMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _accountMock = require('../lib/account-mock');

var _picture = require('../../model/picture');

var _picture2 = _interopRequireDefault(_picture);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCreatePictureMock = function pCreatePictureMock() {
  var resultMock = {};
  return (0, _accountMock.pCreateAccountMock)().then(function (mockAccountResponse) {
    resultMock.accountMock = mockAccountResponse;

    return new _picture2.default({
      title: _faker2.default.lorem.words(7),
      url: _faker2.default.random.image(),
      account: resultMock.accountMock.account._id
    }).save();
  }).then(function (picture) {
    resultMock.picture = picture;
    return resultMock;
  });
};

var pRemovePictureMock = function pRemovePictureMock() {
  return Promise.all([_account2.default.remove({}), _picture2.default.remove({})]);
};

exports.pCreatePictureMock = pCreatePictureMock;
exports.pRemovePictureMock = pRemovePictureMock;
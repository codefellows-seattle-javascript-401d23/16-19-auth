'use strict';
'use strick';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pRemoveItemMock = exports.pCreateItemMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _accountMock = require('./account-mock');

var _item = require('../../model/item');

var _item2 = _interopRequireDefault(_item);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCreateItemMock = function pCreateItemMock() {
  var resultMock = {};
  return (0, _accountMock.pCreateAccountMock)().then(function (mockAcctResponse) {
    resultMock.accountMock = mockAcctResponse;

    return new _item2.default({
      title: _faker2.default.lorem.words(5),
      url: _faker2.default.random.image(),
      account: resultMock.accountMock.account._id
    }).save();
  }).then(function (item) {
    resultMock.item = item;
    return resultMock;
  });
};

var pRemoveItemMock = function pRemoveItemMock() {
  return Promise.all([_account2.default.remove({}), _item2.default.remove({})]);
};

exports.pCreateItemMock = pCreateItemMock;
exports.pRemoveItemMock = pRemoveItemMock;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pRemoveSongMock = exports.pCreateSongMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _song = require('../../model/song');

var _song2 = _interopRequireDefault(_song);

var _accountMock = require('./account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCreateSongMock = function pCreateSongMock() {
  var resultMock = {};
  return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
    resultMock.accountSetMock = accountSetMock;
    return new _song2.default({
      song: _faker2.default.lorem.words(10),
      artist: _faker2.default.random.image(),
      genre: _faker2.default.name.lastName(),
      length: _faker2.default.name.firstName(),
      account: accountSetMock.account._id // this line sets up the relationship
    }).save();
  }).then(function (song) {
    resultMock.song = song;
    return resultMock;
  });
};

var pRemoveSongMock = function pRemoveSongMock() {
  return Promise.all([_song2.default.remove({}), (0, _accountMock.pRemoveAccountMock)()]);
};

exports.pCreateSongMock = pCreateSongMock;
exports.pRemoveSongMock = pRemoveSongMock;
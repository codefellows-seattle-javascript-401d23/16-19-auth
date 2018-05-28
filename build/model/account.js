'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var accountSchema = _mongoose2.default.Schema({
  passwordHash: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true
  },
  created: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  }
});

var TOKEN_SEED_SIZE = 128;
var HASH_SALT_ROUNDS = 8;

function verifyPassword(password) {
  var _this = this;

  return _bcrypt2.default.compare(password, this.passwordHash).then(function (result) {
    if (!result) {
      throw new _httpErrors2.default(401, '__AUTH__ incorrect username or password');
    }
    return _this;
  });
}

function createToken() {
  this.tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_SIZE).toString('hex');

  return this.save().then(function (account) {
    return _jsonwebtoken2.default.sign({ tokenSeed: account.tokenSeed }, process.env.THE_DESPERATE_SECRET);
  });
}

accountSchema.methods.verifyPassword = verifyPassword;
accountSchema.methods.createToken = createToken;

var Account = module.exports = _mongoose2.default.model('account', accountSchema);

Account.create = function (username, email, password) {
  return _bcrypt2.default.hash(password, HASH_SALT_ROUNDS).then(function (passwordHash) {
    var tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_SIZE).toString('hex');
    return new Account({
      username: username,
      email: email,
      passwordHash: passwordHash,
      tokenSeed: tokenSeed
    }).save();
  });
};
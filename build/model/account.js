'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import HttpError from 'http-errors';

// generate hash
var HASH_ROUNDS = 8; // generate random data

var TOKEN_SEED_LENGTH = 128;

var accountSchema = _mongoose2.default.Schema({
  passwordHash: {
    type: String,
    required: true
  },
  // username: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
    unique: true
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true
  },
  timeStamp: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  }
});

//  login function
function verifyPassword(password) {
  var _this = this;

  return _bcrypt2.default.compare(password, this.passwordHash).then(function (result) {
    if (!result) {
      // Vinicio - A 401 code would be the 'proper' response
      throw new HttpError(400, 'AUTH - incorrect data');
    }
    return _this;
  });
}

function pCreateToken() {
  this.tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save().then(function (account) {
    // token seed present
    // sign method = encypt
    return _jsonwebtoken2.default.sign({ tokenSeed: account.tokenSeed }, process.env.PICTURE_CLOUD_SECRET); // token is now encrypted
  });
  // TODO: error management here
}

accountSchema.methods.pCreateToken = pCreateToken;

var Account = _mongoose2.default.model('account', accountSchema);

/* Hash variables:
    - SALT
    - Hashing algo (bcrypt)
    - password
    - rounds
 */
Account.create = function (username, email, password) {
  return _bcrypt2.default.hash(password, HASH_ROUNDS).then(function (passwordHash) {
    // have the password hash
    password = null; // eslint-disable-line
    var tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex'); // hex is needed due to HTTP
    return new Account({
      username: username,
      email: email,
      passwordHash: passwordHash,
      tokenSeed: tokenSeed
    }).save();
  });
};

exports.default = Account;
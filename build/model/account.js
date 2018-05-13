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

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// CAPS naming conventions only apply to strings and numbers.
// used to generate random data
var HASH_ROUNDS = 8; // used to generate hash

var TOKEN_SEED_LENGTH = 128;

var accountSchema = _mongoose2.default.Schema({
  passwordHash: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
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
  createdOn: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  }
});

/* this function is going to be used to login
TODO: check code for where else this function is called. */
function verifyPassword(password) {
  var _this = this;

  return _bcrypt2.default.compare(password, this.passwordHash).then(function (result) {
    if (!result) {
      // A 401 code would be the 'proper' response.
      throw new _httpErrors2.default(400, 'AUTH - incorrect data.');
    }
    return _this; // returns the entire current account.
  });
}

function createToken() {
  // 'this' is equal to the account object we are working with.
  this.tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  console.log('token Seed', this.tokenSeed);
  return this.save().then(function (account) {
    console.log('account.js', account);
    // at this point we have a tokenSeed.
    // .sign === encrypt, this line returns a promise which resolves to a token.
    return _jsonwebtoken2.default.sign({ tokenSeed: account.tokenSeed }, process.env.IMAGE_UPLOAD_SECRET); // When this promise resolves, I have a token.
  }).catch(function () {
    createToken();
  });
  // TODO: error management, recursive, make sure token is unique.
}

accountSchema.methods.verifyPassword = verifyPassword;
accountSchema.methods.createToken = createToken;

var Account = _mongoose2.default.model('account', accountSchema);

/* Hash variables: 
    - SALT
    - HASHING algorithm (bcrypt)
    - password
    - rounds
*/
Account.create = function (username, email, password) {
  return _bcrypt2.default.hash(password, HASH_ROUNDS).then(function (passwordHash) {
    // We have the password hash
    password = null; // eslint-disable-line
    var tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex'); // hex is used due to HTTP
    return new Account({
      username: username,
      email: email,
      passwordHash: passwordHash,
      tokenSeed: tokenSeed
    }).save();
  });
};

exports.default = Account;
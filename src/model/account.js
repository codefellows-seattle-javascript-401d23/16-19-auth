'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // generate hash
import crypto from 'crypto'; // generate random data
import jsonWebToken from 'jsonwebtoken';
// import HttpError from 'http-errors';

const HASH_ROUNDS = 8;
const TOKEN_SEED_LENGTH = 128;

const accountSchema = mongoose.Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  // username: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  timeStamp: {
    type: Date,
    default: () => new Date(),
  },
});

//  login function
function verifyPassword (password) {
  return bcrypt.compare(password, this.passwordHash)
    .then((result) => {
      if (!result) {
        // Vinicio - A 401 code would be the 'proper' response
        throw new HttpError(400, 'AUTH - incorrect data');
      }
      return this;
    });
}

function pCreateToken() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((account) => {
      // token seed present
      // sign method = encypt
      return jsonWebToken.sign(
        { tokenSeed: account.tokenSeed },
        process.env.PICTURE_CLOUD_SECRET,
      ); // token is now encrypted
    });
  // TODO: error management here
}

accountSchema.methods.pCreateToken = pCreateToken;

const Account = mongoose.model('account', accountSchema);

/* Hash variables:
    - SALT
    - Hashing algo (bcrypt)
    - password
    - rounds
 */
Account.create = (username, email, password) => {
  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      // have the password hash
      password = null; // eslint-disable-line
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex'); // hex is needed due to HTTP
      return new Account({
        username,
        email,
        passwordHash,
        tokenSeed,
      }).save();
    });
};

export default Account;

'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jsonWebToken from 'jsonwebtoken';
import HttpError from 'http-errors';

const HASH_ROUNDS = 8;
const TOKEN_SEED_SIZE = 128;

// Dawn - Vincicio stressed the account schema should never leave the server
const accountSchema = mongoose.Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
});

function pVerifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then((result) => {
      if (!result) {
        throw new HttpError(400, '__AUTH__ incorrect data');
      }
      return this; // returns the current account
    });
}

function pCreateToken() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_SIZE).toString('hex');
  return this.save()
    .then((account) => {
      return jsonWebToken.sign(
        { tokenSeed: account.tokenSeed },
        process.env.PHOTO_BOMB_SECRET,
      );
    });
}

accountSchema.methods.pCreateToken = pCreateToken;
accountSchema.methods.pVerifyPassword = pVerifyPassword;

const Account = module.exports = mongoose.model('account', accountSchema);

Account.create = (username, email, password) => {
  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_SIZE).toString('hex');
      return new Account({
        username,
        email,
        passwordHash,
        tokenSeed,
      }).save();
    });
};

// export default Account;

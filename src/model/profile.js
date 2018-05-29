'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  bio: { type: String },
  avatar: { type: String },
  account: {
    type: mongoose.Schema.ObjectId,
    required: true, // can an account have more than one profile? if yes then false
    unique: true, // this is setting up a 1-1 relationship (only 1 account per profile)
  },
});

export default mongoose.model('profile', profileSchema);

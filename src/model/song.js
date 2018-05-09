'use strict';

import mongoose from 'mongoose';

const songSchema = mongoose.Schema({
  song: { type: String },
  artist: { type: String },
  genre: { type: String },
  length: { type: String },
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
});

export default mongoose.model('profile', songSchema);

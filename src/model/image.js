'use strict';

import mongoose from 'mongoose';

const imageSchema = mongoose.Schema({
  artist: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  genre: { type: String },
  camera: { type: String },

  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

export default mongoose.model('image', imageSchema);

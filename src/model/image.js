'use strict';

import mongoose from 'mongoose';

const imageSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
  },
  genre: { type: String },
  camera: { type: String },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

export default mongoose.model('image', imageSchema);

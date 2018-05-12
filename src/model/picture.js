'use strict';

import mongoose from 'mongoose';

const pictureSchema = mongoose.Schema({
  title: { 
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date, 
    default: () => new Date(),
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

export default mongoose.model('picture', pictureSchema);

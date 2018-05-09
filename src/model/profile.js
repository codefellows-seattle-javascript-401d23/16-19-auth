'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  middleName: { type: String },
  aboutMe: { type: String },
  myPic: { type: String },
  account: {
    type: mongoose.Schema.ObjectId,
  },
});

export default mongoose.model('profile', profileSchema);

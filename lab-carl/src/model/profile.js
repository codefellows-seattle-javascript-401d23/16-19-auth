'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  mantra: { type: String },
  profileImage: { type: String },
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
});

export default mongoose.model('profile', profileSchema);

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var songSchema = _mongoose2.default.Schema({
  song: { type: String },
  artist: { type: String },
  genre: { type: String },
  length: { type: String },
  account: {
    type: _mongoose2.default.Schema.ObjectId,
    required: true,
    unique: true
  }
});

exports.default = _mongoose2.default.model('profile', songSchema);
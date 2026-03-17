const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  event:       { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  qrToken:     { type: String, unique: true },
  qrCode:      { type: String },         // base64 data URL
  attended:    { type: Boolean, default: false },
  attendedAt:  { type: Date },
  checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status:      { type: String, enum: ['registered','attended','cancelled'], default: 'registered' },
}, { timestamps: true });

schema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', schema);

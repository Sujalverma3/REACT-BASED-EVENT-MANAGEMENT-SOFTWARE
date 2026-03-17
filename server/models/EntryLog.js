const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event:     { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  qrToken:   { type: String },
  status:    { type: String, enum: ['allowed','denied','duplicate'], required: true },
  reason:    { type: String, default: '' },
  scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('EntryLog', schema);

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User',         required: true },
  event:         { type: mongoose.Schema.Types.ObjectId, ref: 'Event',        required: true },
  registration:  { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true },
  certificateId: { type: String, unique: true, required: true },
  fileUrl:       { type: String, default: '' },
  emailSent:     { type: Boolean, default: false },
  emailSentAt:   { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', schema);

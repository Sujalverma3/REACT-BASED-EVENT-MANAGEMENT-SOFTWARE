const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  event:   { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, default: '' },
}, { timestamps: true });

schema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', schema);

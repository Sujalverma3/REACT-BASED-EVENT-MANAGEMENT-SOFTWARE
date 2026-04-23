const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title:           { type: String, required: true, trim: true },
  description:     { type: String, required: true },
  date:            { type: Date, required: true },
  time:            { type: String, required: true },
  venue:           { type: String, required: true },
  organizer:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  capacity:        { type: Number, required: true, min: 1 },
  registeredCount: { type: Number, default: 0 },
  category:        { type: String, enum: ['Technical','Cultural','Sports','Workshop','Seminar','Fest','Club Activity','Other'], required: true },
  department:      { type: String, default: 'All Departments' },
  status:          { type: String, enum: ['upcoming','ongoing','completed','cancelled'], default: 'upcoming' },
  tags:            [{ type: String }],
  club:            { type: String, default: '' },   // e.g. 'ByteForge Club'
  isFeatured:      { type: Boolean, default: false },
}, { timestamps: true, toJSON: { virtuals: true } });

schema.virtual('spotsLeft').get(function() {
  return Math.max(0, this.capacity - this.registeredCount);
});

module.exports = mongoose.model('Event', schema);

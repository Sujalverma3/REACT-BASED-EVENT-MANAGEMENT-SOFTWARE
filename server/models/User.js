const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const schema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true, minlength: 6, select: false },
  role:       { type: String, enum: ['student','organizer','admin'], default: 'student' },
  collegeId:  { type: String, required: true, unique: true, trim: true },
  department: { type: String, required: true },
  phone:      { type: String, default: '' },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before save
schema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
schema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};

// Strip password from JSON output
schema.methods.toJSON = function() {
  const o = this.toObject();
  delete o.password;
  return o;
};

module.exports = mongoose.model('User', schema);

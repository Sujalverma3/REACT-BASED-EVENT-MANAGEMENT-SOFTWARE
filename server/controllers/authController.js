const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, collegeId, department, phone } = req.body;
    if (!name || !email || !password || !collegeId || !department)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { collegeId }] });
    if (exists)
      return res.status(400).json({ success: false, message: 'Email or College ID already exists' });

    const user  = await User.create({ name, email, password, collegeId, department, phone });
    const token = makeToken(user._id);
    res.status(201).json({ success: true, token, user });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    // Explicitly select password (field has select:false)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Account deactivated' });

    const ok = await user.matchPassword(password);
    if (!ok)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = makeToken(user._id);
    // toJSON strips password
    res.json({ success: true, token, user: user.toJSON() });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /api/auth/me
exports.getMe = (req, res) => res.json({ success: true, user: req.user });

// PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

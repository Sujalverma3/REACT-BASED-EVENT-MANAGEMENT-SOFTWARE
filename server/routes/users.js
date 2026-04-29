const router       = require('express').Router();
const User         = require('../models/User');
const Registration = require('../models/Registration');
const { protect, authorize } = require('../middlewares/auth');
const userController = require('../controllers/userController');

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.user._id })
      .populate('event', 'title date venue category status')
      .sort({ createdAt: -1 });
    res.json({ success: true, user: req.user, registrations: regs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true });
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// GET /api/users  — admin/organizer list
router.get('/', protect, authorize('admin','organizer'), async (req, res) => {
  try {
    const { role, search } = req.query;
    const q = {};
    if (role) q.role = role;
    if (search) q.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { collegeId: { $regex: search, $options: 'i' } },
    ];
    const users = await User.find(q).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ── CLUB MEMBERSHIP ──

// GET /api/users/clubs - Get my clubs
router.get('/clubs', protect, userController.getMyClubs);

// POST /api/users/clubs - Join club
router.post('/clubs', protect, authorize('student'), userController.joinClub);

// DELETE /api/users/clubs/:clubName - Leave club
router.delete('/clubs/:clubName', protect, authorize('student'), userController.leaveClub);

module.exports = router;

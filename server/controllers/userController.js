const User = require('../models/User');
const { authorize } = require('../middlewares/auth');

// GET /api/users/clubs - Get user's clubs
exports.getMyClubs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('clubs');
    res.json({ success: true, clubs: user.clubs || [] });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// POST /api/users/clubs - Join club (student only)
exports.joinClub = async (req, res) => {
  try {
    const { clubName } = req.body;
    if (!clubName || typeof clubName !== 'string') {
      return res.status(400).json({ success: false, message: 'Club name required' });
    }

    const user = await User.findById(req.user._id);
    if (user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can join clubs' });
    }

    if (user.clubs.includes(clubName)) {
      return res.status(400).json({ success: false, message: `Already member of ${clubName}` });
    }

    user.clubs.push(clubName);
    await user.save();
    res.json({ success: true, message: `Joined ${clubName}!`, clubs: user.clubs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// DELETE /api/users/clubs/:clubName - Leave club
exports.leaveClub = async (req, res) => {
  try {
    const { clubName } = req.params;
    const user = await User.findById(req.user._id);

    if (user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can manage club membership' });
    }

    const index = user.clubs.indexOf(clubName);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Not member of ${clubName}` });
    }

    user.clubs.splice(index, 1);
    await user.save();
    res.json({ success: true, message: `Left ${clubName}`, clubs: user.clubs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


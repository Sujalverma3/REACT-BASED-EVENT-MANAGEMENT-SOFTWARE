const router      = require('express').Router();
const Certificate = require('../models/Certificate');
const Registration = require('../models/Registration');
const { protect } = require('../middlewares/auth');

// GET /api/certificates/my  — all my certificates
router.get('/my', protect, async (req, res) => {
  try {
    const certs = await Certificate.find({ user: req.user._id })
      .populate('event', 'title date venue category status')
      .sort({ createdAt: -1 });
    res.json({ success: true, certs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// GET /api/certificates/check/:eventId  — check if I have a cert for this event
router.get('/check/:eventId', protect, async (req, res) => {
  try {
    // Check registration first
    const reg = await Registration.findOne({ user: req.user._id, event: req.params.eventId });
    if (!reg) return res.json({ success: true, registered: false, attended: false, hasCertificate: false });

    const cert = await Certificate.findOne({ user: req.user._id, event: req.params.eventId })
      .populate('event', 'title date venue');

    res.json({
      success: true,
      registered: true,
      attended: reg.attended,
      attendedAt: reg.attendedAt || null,
      hasCertificate: !!cert,
      certificate: cert || null,
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// GET /api/certificates/verify/:certId  — public verification
router.get('/verify/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('user',  'name collegeId department')
      .populate('event', 'title date venue category');
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, cert });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;

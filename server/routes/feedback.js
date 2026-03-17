const router       = require('express').Router();
const Feedback     = require('../models/Feedback');
const Registration = require('../models/Registration');
const { protect, authorize } = require('../middlewares/auth');

// IMPORTANT: /check/:eventId MUST come before /:eventId
// otherwise Express matches "check" as an eventId

// GET /api/feedback/check/:eventId
router.get('/check/:eventId', protect, authorize('student'), async (req, res) => {
  try {
    const fb = await Feedback.findOne({ user: req.user._id, event: req.params.eventId });
    res.json({ success: true, submitted: !!fb, feedback: fb || null });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/feedback/:eventId
router.post('/:eventId', protect, authorize('student'), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ success: false, message: 'Rating is required' });
    const reg = await Registration.findOne({ user: req.user._id, event: req.params.eventId, attended: true });
    if (!reg) return res.status(403).json({ success: false, message: 'You must attend the event to give feedback' });
    const exists = await Feedback.findOne({ user: req.user._id, event: req.params.eventId });
    if (exists) return res.status(400).json({ success: false, message: 'Feedback already submitted' });
    const fb = await Feedback.create({ user: req.user._id, event: req.params.eventId, rating, comment });
    res.status(201).json({ success: true, feedback: fb });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// GET /api/feedback/:eventId  (organizer)
router.get('/:eventId', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId }).populate('user', 'name department');
    const avg = feedbacks.length
      ? +(feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : 0;
    res.json({ success: true, count: feedbacks.length, avgRating: avg, feedbacks });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;

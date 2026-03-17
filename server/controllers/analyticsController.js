const Event        = require('../models/Event');
const Registration = require('../models/Registration');
const Certificate  = require('../models/Certificate');
const Feedback     = require('../models/Feedback');
const EntryLog     = require('../models/EntryLog');
const User         = require('../models/User');

// GET /api/analytics/dashboard
exports.dashboard = async (req, res) => {
  try {
    const [totalEvents, totalRegs, totalAttended, totalCerts, totalStudents, fakeAttempts] =
      await Promise.all([
        Event.countDocuments(),
        Registration.countDocuments(),
        Registration.countDocuments({ attended: true }),
        Certificate.countDocuments(),
        User.countDocuments({ role: 'student' }),
        EntryLog.countDocuments({ status: { $in: ['denied','duplicate'] } }),
      ]);

    const attendanceRate = totalRegs > 0 ? Math.round((totalAttended / totalRegs) * 100) : 0;

    // Dept-wise attendance
    const deptStats = await Registration.aggregate([
      { $match: { attended: true } },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'u' } },
      { $unwind: '$u' },
      { $group: { _id: '$u.department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // Monthly registrations last 6 months
    const since = new Date(); since.setMonth(since.getMonth() - 6);
    const monthlyRegs = await Registration.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]);

    // Recent events
    const recentEvents = await Event.find()
      .populate('organizer', 'name')
      .sort({ createdAt: -1 }).limit(8);

    res.json({
      success: true,
      stats: { totalEvents, totalRegs, totalAttended, attendanceRate, totalCerts, totalStudents, fakeAttempts },
      deptStats,
      monthlyRegs,
      recentEvents,
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// GET /api/analytics/event/:id
exports.eventStats = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const [regs, attended, certs, feedbacks] = await Promise.all([
      Registration.countDocuments({ event: event._id }),
      Registration.countDocuments({ event: event._id, attended: true }),
      Certificate.countDocuments({ event: event._id }),
      Feedback.find({ event: event._id }),
    ]);

    const avgRating = feedbacks.length
      ? +(feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : 0;

    const ratingDist = [1,2,3,4,5].map(r => ({
      rating: r, count: feedbacks.filter(f => f.rating === r).length,
    }));

    const deptBreakdown = await Registration.aggregate([
      { $match: { event: event._id } },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'u' } },
      { $unwind: '$u' },
      { $group: { _id: '$u.department', registered: { $sum: 1 }, attended: { $sum: { $cond: ['$attended', 1, 0] } } } },
      { $sort: { registered: -1 } },
    ]);

    res.json({
      success: true,
      event,
      stats: { regs, attended, rate: regs > 0 ? Math.round((attended / regs) * 100) : 0, certs, avgRating },
      ratingDist,
      deptBreakdown,
      comments: feedbacks.filter(f => f.comment).map(f => ({ comment: f.comment, rating: f.rating })),
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

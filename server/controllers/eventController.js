const Event           = require('../models/Event');
const Registration    = require('../models/Registration');
const QRCode          = require('qrcode');
const { v4: uuid }    = require('uuid');
const syncEventStatus = require('../utils/syncEventStatus');

// GET /api/events
exports.getAll = async (req, res) => {
  try {
    // Always sync status before returning events
    await syncEventStatus();

    const { category, status, department, search, page = 1, limit = 12 } = req.query;
    const q = {};
    if (category)   q.category   = category;
    if (status)     q.status     = status;
    if (department) q.department = department;
    if (search)     q.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    const total  = await Event.countDocuments(q);
    const events = await Event.find(q)
      .populate('organizer', 'name email department')
      .sort({ date: 1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json({ success: true, total, events });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// GET /api/events/:id
exports.getOne = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email department');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// POST /api/events
exports.create = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user._id });
    res.status(201).json({ success: true, event });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// PUT /api/events/:id
exports.update = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, event: updated });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// DELETE /api/events/:id
exports.remove = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await event.deleteOne();
    res.json({ success: true, message: 'Event deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// POST /api/events/:id/register
exports.register = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.status === 'completed' || event.status === 'cancelled')
      return res.status(400).json({ success: false, message: 'Registration closed' });
    if (event.registeredCount >= event.capacity)
      return res.status(400).json({ success: false, message: 'Event is full' });

    const already = await Registration.findOne({ user: req.user._id, event: event._id });
    if (already) {
      return res.json({ success: true, registration: already, qrCode: already.qrCode, alreadyRegistered: true });
    }

    const qrToken = uuid();
    const qrData  = JSON.stringify({ token: qrToken, eventId: event._id.toString(), userId: req.user._id.toString() });
    const qrCode  = await QRCode.toDataURL(qrData);

    const reg = await Registration.create({ user: req.user._id, event: event._id, qrToken, qrCode });
    await Event.findByIdAndUpdate(event._id, { $inc: { registeredCount: 1 } });
    res.status(201).json({ success: true, registration: reg, qrCode });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ success: false, message: 'Already registered' });
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /api/events/:id/registrations
exports.getRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ event: req.params.id })
      .populate('user', 'name email collegeId department');
    res.json({ success: true, count: regs.length, registrations: regs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// GET /api/events/my
exports.getMyEvents = async (req, res) => {
  try {
    await syncEventStatus();
    const events = await Event.find({ organizer: req.user._id }).sort({ date: -1 });
    res.json({ success: true, events });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

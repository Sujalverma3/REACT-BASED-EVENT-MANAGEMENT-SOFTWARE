const Registration = require('../models/Registration');
const EntryLog     = require('../models/EntryLog');
const Event        = require('../models/Event');
const Certificate  = require('../models/Certificate');
const { generateCertificate } = require('../utils/certificateGenerator');
const { sendCertificateEmail } = require('../utils/mailer');
const { v4: uuid } = require('uuid');

// POST /api/attendance/scan
exports.scan = async (req, res) => {
  try {
    const { qrToken, eventId } = req.body;
    if (!qrToken || !eventId)
      return res.status(400).json({ success: false, message: 'qrToken and eventId are required' });

    const reg = await Registration.findOne({ qrToken }).populate('user', 'name email collegeId department');
    if (!reg) {
      await EntryLog.create({ event: eventId, qrToken, status: 'denied', reason: 'Invalid QR', scannedBy: req.user._id });
      return res.status(400).json({ success: false, message: 'Invalid QR code' });
    }

    if (reg.event.toString() !== eventId) {
      await EntryLog.create({ event: eventId, qrToken, status: 'denied', reason: 'Wrong event', scannedBy: req.user._id });
      return res.status(400).json({ success: false, message: 'QR code is for a different event' });
    }

    if (reg.attended) {
      await EntryLog.create({ user: reg.user._id, event: eventId, qrToken, status: 'duplicate', reason: 'Already scanned', scannedBy: req.user._id });
      return res.status(400).json({ success: false, message: 'Already scanned', attendedAt: reg.attendedAt });
    }

    reg.attended    = true;
    reg.attendedAt  = new Date();
    reg.checkedInBy = req.user._id;
    reg.status      = 'attended';
    await reg.save();

    await EntryLog.create({ user: reg.user._id, event: eventId, qrToken, status: 'allowed', scannedBy: req.user._id });

    res.json({
      success: true,
      message: 'Attendance marked!',
      student: { name: reg.user.name, collegeId: reg.user.collegeId, department: reg.user.department },
      attendedAt: reg.attendedAt,
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// POST /api/attendance/certificates/:eventId
exports.issueCerts = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('organizer', 'name');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const attendees = await Registration.find({ event: req.params.eventId, attended: true })
      .populate('user', 'name email collegeId department');

    if (!attendees.length)
      return res.json({ success: true, issued: 0, message: 'No attendees to issue certificates to' });

    const results = [];
    for (const reg of attendees) {
      const exists = await Certificate.findOne({ user: reg.user._id, event: event._id });
      if (exists) { results.push({ name: reg.user.name, status: 'skipped (already issued)' }); continue; }

      const certId  = `GEU-${event._id.toString().slice(-6).toUpperCase()}-${uuid().slice(0,8).toUpperCase()}`;
      const fileUrl = await generateCertificate({ user: reg.user, event, certId });

      const cert = await Certificate.create({
        user: reg.user._id, event: event._id, registration: reg._id, certificateId: certId, fileUrl,
      });

      try {
        await sendCertificateEmail({ user: reg.user, event, certId, fileUrl });
        cert.emailSent = true; cert.emailSentAt = new Date();
        await cert.save();
        results.push({ name: reg.user.name, status: 'issued + emailed', certId });
      } catch {
        results.push({ name: reg.user.name, status: 'issued (email failed)', certId });
      }
    }

    res.json({ success: true, issued: results.filter(r => r.certId).length, results });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// GET /api/attendance/logs/:eventId
exports.getLogs = async (req, res) => {
  try {
    const logs = await EntryLog.find({ event: req.params.eventId })
      .populate('user', 'name collegeId')
      .populate('scannedBy', 'name')
      .sort({ timestamp: -1 }).limit(500);
    res.json({ success: true, count: logs.length, logs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

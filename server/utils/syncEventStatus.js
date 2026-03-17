const Event = require('../models/Event');

/**
 * Auto-updates event status based on current date/time:
 *  - upcoming  → ongoing   if event date is today
 *  - ongoing   → completed if event date was yesterday or earlier
 *  - upcoming  → completed if event date passed (no one manually set ongoing)
 */
const syncEventStatus = async () => {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());           // start of today
  const tomorrow = new Date(today.getTime() + 864e5);                                 // start of tomorrow

  // upcoming → ongoing  (event date is today)
  await Event.updateMany(
    { status: 'upcoming', date: { $gte: today, $lt: tomorrow } },
    { $set: { status: 'ongoing' } }
  );

  // upcoming/ongoing → completed  (event date is before today)
  await Event.updateMany(
    { status: { $in: ['upcoming', 'ongoing'] }, date: { $lt: today } },
    { $set: { status: 'completed' } }
  );
};

module.exports = syncEventStatus;

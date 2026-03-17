const router = require('express').Router();
const ctrl   = require('../controllers/attendanceController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/scan',               protect, authorize('organizer','admin'), ctrl.scan);
router.post('/certificates/:eventId', protect, authorize('organizer','admin'), ctrl.issueCerts);
router.get('/logs/:eventId',       protect, authorize('organizer','admin'), ctrl.getLogs);

module.exports = router;

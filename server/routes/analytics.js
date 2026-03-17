const router = require('express').Router();
const ctrl   = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/dashboard',    protect, authorize('organizer','admin'), ctrl.dashboard);
router.get('/event/:id',    protect, authorize('organizer','admin'), ctrl.eventStats);

module.exports = router;

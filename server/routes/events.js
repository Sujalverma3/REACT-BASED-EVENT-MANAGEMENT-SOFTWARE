const router = require('express').Router();
const ctrl   = require('../controllers/eventController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/',                                                   ctrl.getAll);
router.get('/my',        protect, authorize('organizer','admin'), ctrl.getMyEvents);
router.get('/:id',                                                ctrl.getOne);
router.post('/',         protect, authorize('organizer','admin'), ctrl.create);
router.put('/:id',       protect, authorize('organizer','admin'), ctrl.update);
router.delete('/:id',    protect, authorize('organizer','admin'), ctrl.remove);
router.post('/:id/register', protect, authorize('student'),       ctrl.register);
router.get('/:id/registrations', protect, authorize('organizer','admin'), ctrl.getRegistrations);
router.post('/:id/end', protect, authorize('organizer','admin'), ctrl.endEvent);

module.exports = router;

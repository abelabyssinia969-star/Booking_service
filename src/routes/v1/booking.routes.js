const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/booking.controller');
const { authenticate, authorize } = require('../../middleware/auth');

router.post('/', authenticate, authorize('passenger'), ctrl.create);
router.get('/', authenticate, authorize('passenger','admin'), ctrl.list);
router.get('/:id', authenticate, authorize('passenger','admin'), ctrl.get);
router.put('/:id', authenticate, authorize('passenger'), ctrl.update);
router.delete('/:id', authenticate, authorize('passenger'), ctrl.remove);
// Admin lifecycle and assignment
router.post('/:id/lifecycle', authenticate, authorize('admin'), ctrl.lifecycle);
router.post('/:id/assign', authenticate, authorize('admin','staff'), ctrl.assign);
// Fare estimation by admin
router.post('/estimate', authenticate, authorize('admin'), ctrl.estimate);
// Passenger vehicle types
router.get('/vehicle/types', authenticate, authorize('passenger'), (req, res) => res.json(['mini','sedan','van']));

module.exports = router;


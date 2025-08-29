const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/driver.controller');
const { authenticate, authorize } = require('../../middleware/auth');

// Remove driver creation via API
router.get('/', authenticate, authorize('admin','staff'), ctrl.list);
router.get('/available', authenticate, authorize('admin','staff','passenger'), ctrl.availableNearby);
router.get('/:id', authenticate, authorize('admin','staff'), ctrl.get);
// Driver self-service
router.post('/:id/availability', authenticate, authorize('driver'), ctrl.setAvailability);
router.post('/:id/location', authenticate, authorize('driver'), ctrl.updateLocation);

module.exports = router;


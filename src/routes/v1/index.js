const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middleware/auth');

router.use('/auth', require('./auth.routes'));
// all routes below require authentication
router.use(authenticate);

router.use('/bookings', require('./booking.routes'));
router.use('/assignments', authorize('admin','staff'), require('./assignment.routes'));
router.use('/trips', authorize('admin','staff'), require('./trip.routes'));
router.use('/live', require('./live.routes'));
router.use('/pricing', authorize('admin'), require('./pricing.routes'));
router.use('/drivers', require('./driver.routes'));

module.exports = router;


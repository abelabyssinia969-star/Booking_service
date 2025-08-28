const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/bookings', require('./booking.routes'));
router.use('/assignments', require('./assignment.routes'));
router.use('/trips', require('./trip.routes'));
router.use('/live', require('./live.routes'));
router.use('/pricing', require('./pricing.routes'));
router.use('/drivers', require('./driver.routes'));
router.use('/passengers', require('./passenger.routes'));

module.exports = router;


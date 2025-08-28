const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/driver.controller');
const { auth } = require('../../middleware/auth');

router.post('/', auth(), ctrl.create);
router.get('/', auth(false), ctrl.list);
router.get('/available', auth(false), ctrl.availableNearby);
router.get('/:id', auth(false), ctrl.get);
router.put('/:id', auth(), ctrl.update);
router.delete('/:id', auth(), ctrl.remove);
router.post('/:id/availability', auth(), ctrl.setAvailability);
router.post('/:id/location', auth(), ctrl.updateLocation);

module.exports = router;


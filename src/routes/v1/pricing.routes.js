const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/pricing.controller');
const { auth, requireRoles } = require('../../middleware/auth');

router.post('/', auth(), requireRoles('admin'), ctrl.create);
router.get('/', auth(false), ctrl.list);
router.get('/:id', auth(false), ctrl.get);
router.put('/:id', auth(), requireRoles('admin'), ctrl.updateAndBroadcast);
router.delete('/:id', auth(), requireRoles('admin'), ctrl.remove);

module.exports = router;


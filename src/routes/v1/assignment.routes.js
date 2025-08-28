const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/assignment.controller');
const { auth, requireRoles } = require('../../middleware/auth');

router.post('/', auth(), requireRoles('staff','admin'), ctrl.create);
router.get('/', auth(), requireRoles('staff','admin'), ctrl.list);
router.get('/:id', auth(), requireRoles('staff','admin'), ctrl.get);
router.put('/:id', auth(), requireRoles('staff','admin'), ctrl.update);
router.delete('/:id', auth(), requireRoles('staff','admin'), ctrl.remove);

module.exports = router;


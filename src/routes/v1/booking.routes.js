const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/booking.controller');
const { auth, requireRoles } = require('../../middleware/auth');

router.post('/', auth(), requireRoles('passenger'), ctrl.create);
router.get('/', auth(), requireRoles('passenger'), ctrl.list);
router.get('/:id', auth(), requireRoles('passenger'), ctrl.get);
router.put('/:id', auth(), requireRoles('passenger'), ctrl.update);
router.delete('/:id', auth(), requireRoles('passenger'), ctrl.remove);
// passenger-only actions; assignment/lifecycle handled implicitly for passenger
router.post('/:id/lifecycle', auth(), requireRoles('passenger'), ctrl.lifecycle);
router.post('/:id/assign', auth(), requireRoles('passenger'), ctrl.assign);
router.post('/estimate', auth(), requireRoles('passenger'), ctrl.estimate);
router.get('/vehicle/types', auth(), requireRoles('passenger'), (req, res) => res.json(['mini','sedan','van']));

module.exports = router;


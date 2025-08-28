const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/booking.controller');
const { auth } = require('../../middleware/auth');

router.post('/', auth(), ctrl.create);
router.get('/', auth(false), ctrl.list);
router.get('/:id', auth(), ctrl.get);
router.put('/:id', auth(), ctrl.update);
router.delete('/:id', auth(), ctrl.remove);
router.post('/:id/lifecycle', auth(), ctrl.lifecycle);
router.post('/:id/assign', auth(), ctrl.assign);
router.post('/estimate', auth(false), ctrl.estimate);
router.get('/vehicle/types', auth(false), (req, res) => res.json(['mini','sedan','van']));

module.exports = router;


const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/passenger.controller');
const { auth } = require('../../middleware/auth');

router.post('/', auth(), ctrl.create);
router.get('/', auth(), ctrl.list);
router.get('/:id', auth(), ctrl.get);
router.put('/:id', auth(), ctrl.update);
router.delete('/:id', auth(), ctrl.remove);

module.exports = router;


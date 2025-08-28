const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/live.controller');
const { auth } = require('../../middleware/auth');

router.post('/', auth(), ctrl.create);
router.get('/', auth(), ctrl.list);
router.get('/:id', auth(), ctrl.get);
router.put('/:id', auth(), ctrl.update);
router.delete('/:id', auth(), ctrl.remove);
router.post('/push', auth(), ctrl.push);

module.exports = router;


const express = require('express');
const router = express.Router();
// Passenger CRUD via auth endpoints only; disable direct CRUD routes
const { authenticate, authorize } = require('../../middleware/auth');
const express = require('express');
const router = express.Router();
router.get('/', authenticate, authorize('admin','staff'), (req,res)=>res.json([]));

module.exports = router;


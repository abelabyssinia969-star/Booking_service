const { Live } = require('../models/bookingModels');
const { crudController } = require('./basic.crud');
const { broadcast } = require('../sockets');

const base = crudController(Live);

async function push(req, res) {
  try {
    const item = await Live.create(req.body);
    broadcast('driver:position', item);
    return res.status(201).json(item);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

module.exports = { ...base, push };


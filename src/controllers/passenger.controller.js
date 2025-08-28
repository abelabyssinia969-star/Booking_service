const { Passenger } = require('../models/userModels');
const { crudController } = require('./basic.crud');

module.exports = { ...crudController(Passenger) };


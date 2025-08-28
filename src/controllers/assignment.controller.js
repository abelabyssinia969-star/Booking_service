const { BookingAssignment } = require('../models/bookingModels');
const { crudController } = require('./basic.crud');

module.exports = { ...crudController(BookingAssignment) };


const mongoose = require('mongoose');
const { LocationSchema, VehicleTypeEnum } = require('./common');

const BookingStatus = ['requested', 'accepted', 'ongoing', 'completed', 'canceled'];

const FareBreakdownSchema = new mongoose.Schema({
  base: { type: Number, default: 0 },
  distanceCost: { type: Number, default: 0 },
  timeCost: { type: Number, default: 0 },
  waitingCost: { type: Number, default: 0 },
  surgeMultiplier: { type: Number, default: 1 }
}, { _id: false });

const BookingSchema = new mongoose.Schema({
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  vehicleType: { type: String, enum: VehicleTypeEnum, default: 'mini' },
  pickup: { type: LocationSchema, required: true },
  dropoff: { type: LocationSchema, required: true },
  status: { type: String, enum: BookingStatus, default: 'requested', index: true },
  fareEstimated: { type: Number, default: 0 },
  fareFinal: { type: Number, default: 0 },
  fareBreakdown: { type: FareBreakdownSchema, default: () => ({}) },
  distanceKm: { type: Number, default: 0 },
  durationMinutes: { type: Number, default: 0 },
  waitingMinutes: { type: Number, default: 0 },
  acceptedAt: { type: Date },
  startedAt: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

const BookingAssignmentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  dispatcherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: true }
}, { timestamps: true });

const TripHistorySchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' },
  dateOfTravel: { type: Date, default: Date.now },
  status: { type: String, enum: BookingStatus, required: true }
}, { timestamps: true });

const LiveSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'TripHistory' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  timestamp: { type: Date, default: Date.now },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  status: { type: String, enum: BookingStatus }
}, { timestamps: true });

module.exports = {
  Booking: mongoose.model('Booking', BookingSchema),
  BookingAssignment: mongoose.model('BookingAssignment', BookingAssignmentSchema),
  TripHistory: mongoose.model('TripHistory', TripHistorySchema),
  Live: mongoose.model('Live', LiveSchema),
  BookingStatus
};


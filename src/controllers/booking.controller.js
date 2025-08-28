const dayjs = require('dayjs');
const geolib = require('geolib');
const { Booking, BookingAssignment, TripHistory, Live, BookingStatus } = require('../models/bookingModels');
const { Pricing } = require('../models/pricing');
const { broadcast } = require('../sockets');

async function estimateFare({ vehicleType = 'mini', pickup, dropoff, durationMinutes = 0, waitingMinutes = 0 }) {
  const distanceKm = geolib.getDistance(
    { latitude: pickup.latitude, longitude: pickup.longitude },
    { latitude: dropoff.latitude, longitude: dropoff.longitude }
  ) / 1000;
  const p = await Pricing.findOne({ vehicleType, isActive: true }).sort({ updatedAt: -1 }) || { baseFare: 2, perKm: 1, perMinute: 0.2, waitingPerMinute: 0.1, surgeMultiplier: 1 };
  const fareBreakdown = {
    base: p.baseFare,
    distanceCost: distanceKm * p.perKm,
    timeCost: durationMinutes * p.perMinute,
    waitingCost: waitingMinutes * p.waitingPerMinute,
    surgeMultiplier: p.surgeMultiplier,
  };
  const fareEstimated = (fareBreakdown.base + fareBreakdown.distanceCost + fareBreakdown.timeCost + fareBreakdown.waitingCost) * fareBreakdown.surgeMultiplier;
  return { distanceKm, fareEstimated, fareBreakdown };
}

exports.create = async (req, res) => {
  try {
    const passengerId = req.user?.id || req.body.passengerId;
    const { vehicleType, pickup, dropoff, durationMinutes, waitingMinutes } = req.body;
    const est = await estimateFare({ vehicleType, pickup, dropoff, durationMinutes, waitingMinutes });
    const booking = await Booking.create({ passengerId, vehicleType, pickup, dropoff, distanceKm: est.distanceKm, durationMinutes, waitingMinutes, fareEstimated: est.fareEstimated, fareBreakdown: est.fareBreakdown });
    return res.status(201).json(booking);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

exports.list = async (req, res) => {
  try { const data = await Booking.find({ passengerId: req.user?.id }).sort({ createdAt: -1 }); return res.json(data); } catch (e) { return res.status(500).json({ message: e.message }); }
}

exports.get = async (req, res) => {
  try { const item = await Booking.findOne({ _id: req.params.id, passengerId: req.user?.id }); if (!item) return res.status(404).json({ message: 'Not found' }); return res.json(item); } catch (e) { return res.status(500).json({ message: e.message }); }
}

exports.update = async (req, res) => {
  try {
    const updated = await Booking.findOneAndUpdate({ _id: req.params.id, passengerId: req.user?.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

exports.remove = async (req, res) => {
  try { const r = await Booking.findOneAndDelete({ _id: req.params.id, passengerId: req.user?.id }); if (!r) return res.status(404).json({ message: 'Not found' }); return res.json({ ok: true }); } catch (e) { return res.status(500).json({ message: e.message }); }
}

exports.lifecycle = async (req, res) => {
  try {
    const { status, driverId } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (!['requested','accepted','ongoing','completed','canceled'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    booking.status = status;
    if (status === 'accepted') { booking.acceptedAt = new Date(); if (driverId) booking.driverId = driverId; }
    if (status === 'ongoing') { booking.startedAt = new Date(); }
    if (status === 'completed') { booking.completedAt = new Date(); booking.fareFinal = booking.fareEstimated; }
    await booking.save();
    await TripHistory.create({ bookingId: booking._id, driverId: booking.driverId, passengerId: booking.passengerId, status: booking.status });
    broadcast('booking:update', { id: booking.id || String(booking._id || ''), status });
    return res.json(booking);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

exports.assign = async (req, res) => {
  try {
    const { driverId, dispatcherId, passengerId } = req.body;
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    const assignment = await BookingAssignment.create({ bookingId, driverId, dispatcherId, passengerId: passengerId || booking.passengerId });
    booking.driverId = driverId; booking.status = 'accepted'; booking.acceptedAt = new Date(); await booking.save();
    broadcast('booking:assigned', { bookingId, driverId });
    return res.json({ booking, assignment });
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

exports.estimate = async (req, res) => {
  try {
    const { vehicleType, pickup, dropoff, durationMinutes = 0, waitingMinutes = 0 } = req.body;
    const est = await estimateFare({ vehicleType, pickup, dropoff, durationMinutes, waitingMinutes });
    return res.json(est);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}


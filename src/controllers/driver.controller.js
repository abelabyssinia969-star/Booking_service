const { Driver } = require('../models/userModels');
const { crudController } = require('./basic.crud');

const base = crudController(Driver);

async function setAvailability(req, res) {
  try { const d = await Driver.findByIdAndUpdate(req.params.id, { available: !!req.body.available }, { new: true }); if (!d) return res.status(404).json({ message: 'Not found' }); return res.json(d); } catch (e) { return res.status(500).json({ message: e.message }); }
}

async function updateLocation(req, res) {
  try { const { latitude, longitude } = req.body; const d = await Driver.findByIdAndUpdate(req.params.id, { lastKnownLocation: { latitude, longitude } }, { new: true }); if (!d) return res.status(404).json({ message: 'Not found' }); return res.json(d); } catch (e) { return res.status(500).json({ message: e.message }); }
}

async function availableNearby(req, res) {
  try {
    const { latitude, longitude, radiusKm = 5, vehicleType } = req.query;
    const all = await Driver.find({ available: true, ...(vehicleType ? { vehicleType } : {}) });
    const nearby = all.filter(d => d.lastKnownLocation && distanceKm(d.lastKnownLocation, { latitude: +latitude, longitude: +longitude }) <= +radiusKm);
    return res.json(nearby);
  } catch (e) { return res.status(500).json({ message: e.message }); }
}

function distanceKm(a, b) {
  if (!a || !b || a.latitude == null || b.latitude == null) return Number.POSITIVE_INFINITY;
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const aHarv = Math.sin(dLat/2)**2 + Math.sin(dLon/2)**2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(aHarv));
}

module.exports = { ...base, setAvailability, updateLocation, availableNearby };


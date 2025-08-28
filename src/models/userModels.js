const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({ name: { type: String, required: true, unique: true } }, { timestamps: true });
const PermissionSchema = new mongoose.Schema({ name: { type: String, required: true, unique: true } }, { timestamps: true });

const PassengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, index: true, unique: true },
  email: { type: String, index: true, unique: true },
  password: { type: String, required: true },
  emergencyContacts: [{ name: String, phone: String }],
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
}, { timestamps: true });

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, index: true, unique: true },
  email: { type: String, index: true, unique: true },
  password: { type: String, required: true },
  vehicleType: { type: String, enum: ['mini', 'sedan', 'van'], default: 'mini' },
  available: { type: Boolean, default: false },
  lastKnownLocation: { latitude: Number, longitude: Number },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
}, { timestamps: true });

const StaffSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
}, { timestamps: true });

const AdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
}, { timestamps: true });

module.exports = {
  Role: mongoose.model('Role', RoleSchema),
  Permission: mongoose.model('Permission', PermissionSchema),
  Passenger: mongoose.model('Passenger', PassengerSchema),
  Driver: mongoose.model('Driver', DriverSchema),
  Staff: mongoose.model('Staff', StaffSchema),
  Admin: mongoose.model('Admin', AdminSchema)
};


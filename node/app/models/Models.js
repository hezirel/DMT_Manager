const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  country: {type: String, required: true},
  city: {type: String, required: true},
  zip: {type: String, required: false},
  street: {type: String, required: false},
  number: {type: Number, required: false},
  label: {type: String, required: false},
});
const Location = mongoose.model('locations', locationSchema);

const driverSchema = new mongoose.Schema({
  name: {type: String, required: true},
});
const Driver = mongoose.model('drivers', driverSchema);

const vehicleSchema = new mongoose.Schema({
  brand: {type: String, required: true},
  model: {type: String, required: true},
  plate: {type: String, required: true}
});
const Vehicle = mongoose.model('vehicles', vehicleSchema);

const clientSchema = new mongoose.Schema({
  clientid: {type: String, required: true},
  locations: [{type: mongoose.Schema.Types.ObjectId, ref: 'locations'}]
});
const Client = mongoose.model('clients', clientSchema);

const placeTimeSchema = new mongoose.Schema({
  type: {type: String, enum: ['pickup', 'dropoff'], required: true},
  date: {type: Date, required: true, default: Date.now},
  client: {type: mongoose.Schema.Types.ObjectId, ref: 'clients'},
  place: {type: mongoose.Schema.Types.ObjectId, ref: 'locations'}
});
const PlaceTime = mongoose.model('placetimes', placeTimeSchema);

const transportSchema = new mongoose.Schema({
  driver: {type: mongoose.Schema.Types.ObjectId, ref: 'drivers'},
  pickup: {type: mongoose.Schema.Types.ObjectId, ref: 'placetimes', required: true},
  dropoff: {type: mongoose.Schema.Types.ObjectId, ref: 'placetimes', required: true},
});
const Transport = mongoose.model('transports', transportSchema);

module.exports = {
  Driver,
  Client,
  Location,
  Vehicle,
  Transport,
  PlaceTime
};

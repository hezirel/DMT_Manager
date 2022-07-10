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
  age: {type: Number, required: true}
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
  locations: [locationSchema]
});
const Client = mongoose.model('clients', clientSchema);

const placeTimeSchema = new mongoose.Schema({
  place: {type: locationSchema, required: true},
  date: {type: Date, required: true, default: Date.now}
});
const PlaceTime = mongoose.model('placetimes', placeTimeSchema);

const deliverySchema = new mongoose.Schema({
  client: {type: mongoose.Schema.Types.ObjectId, ref: 'clients', required: false},
  driver: {type: mongoose.Schema.Types.ObjectId, ref: 'drivers', required: true},
  vehicle: {type: mongoose.Schema.Types.ObjectId, ref: 'vehicles', required: false},
  pickup: {type: placeTimeSchema, required: false},
  dropoff: {type: placeTimeSchema, required: false},
  pickupDate: {type: Date, required: false},
  deliveryDate: {type: Date, required: false},
  distance: {type: Number, required: false}
});
const Delivery = mongoose.model('deliveries', deliverySchema);

module.exports = {
  Driver,
  Client,
  Location,
  Vehicle,
  Delivery,
  PlaceTime
};

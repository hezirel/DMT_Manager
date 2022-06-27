const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  country: {type: String, required: true},
  city: {type: String, required: true},
  zip: {type: String, required: true},
  street: {type: String, required: true},
  number: {type: Number, required: true},
  label: {type: String, required: false},
  clientid: {type: String, required: false}
});

const driverSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age: {type: Number, required: true}
});

const vehicleSchema = new mongoose.Schema({
  brand: {type: String, required: true},
  model: {type: String, required: true},
  plate: {type: String, required: true}
});

const clientSchema = new mongoose.Schema({
  clientid: {type: String, required: true},
  locations: [locationSchema]
});

const placeTimeSchema = new mongoose.Schema({
  place: {type: locationSchema, required: true},
  date: {type: Date, required: true}
});

const deliverySchema = new mongoose.Schema({
  client: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: false},
  driver: {type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true},
  vehicle: {type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: false},
  pickup: {type: placeTimeSchema, required: false},
  delivery: {type: placeTimeSchema, required: false},
  pickupDate: {type: Date, required: false},
  deliveryDate: {type: Date, required: false},
  distance: {type: Number, required: false}
});

const Driver = mongoose.model('drivers', driverSchema);
const Client = mongoose.model('clients', clientSchema);
const Location = mongoose.model('locations', locationSchema);
const Vehicle = mongoose.model('vehicles', vehicleSchema);
const Delivery = mongoose.model('deliveries', deliverySchema);
const PlaceTime = mongoose.model('placetimes', placeTimeSchema);

module.exports = {
  Driver,
  Client,
  Location,
  Vehicle,
  Delivery,
  PlaceTime
};

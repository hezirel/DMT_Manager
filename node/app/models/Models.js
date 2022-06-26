const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age: {type: Number, required: true}
});

const locationSchema = new mongoose.Schema({
  country: {type: String, required: true},
  city: {type: String, required: true},
  zip: {type: String, required: true},
  street: {type: String, required: true},
  number: {type: Number, required: true},
  label: {type: String, required: false}
});

const clientSchema = new mongoose.Schema({
  name: {type: String, required: true},
  locations: [locationSchema]
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;

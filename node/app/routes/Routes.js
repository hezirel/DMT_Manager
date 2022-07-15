const express = require('express');
const driverRouter = express.Router();
const clientRouter = express.Router();
const transportRouter = express.Router();
const parcelRouter = express.Router();

const Controllers = require('../controllers/Controllers');

driverRouter.post('/add', Controllers.postDriver);
driverRouter.get('/get', Controllers.getDrivers);

clientRouter.post('/add', Controllers.postClient);
clientRouter.get('/get', Controllers.getClients);
clientRouter.post('/list', Controllers.getClientLocations);

transportRouter.post('/add', Controllers.postTransport);

parcelRouter.get('/', Controllers.getParcels);

module.exports = {
  driverRouter,
  parcelRouter,
  clientRouter,
  transportRouter
}

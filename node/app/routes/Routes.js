const express = require('express');
const driverRouter = express.Router();
const deliveryRouter = express.Router();
const clientRouter = express.Router();

const Controllers = require('../controllers/Controllers');

driverRouter.get('/get', Controllers.getDrivers);
driverRouter.post('/add', Controllers.postDriver);

deliveryRouter.get('/', Controllers.getDeliveries);
deliveryRouter.post('/add', Controllers.postDelivery);

clientRouter.get('/get', Controllers.getClients);
clientRouter.post('/add', Controllers.postClient);
clientRouter.post("/list", Controllers.getClientLocations);

module.exports = {
  driverRouter,
  deliveryRouter,
  clientRouter
}

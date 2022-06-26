const express = require('express');
const driverRouter = express.Router();
const deliveryRouter = express.Router();
const clientRouter = express.Router();

const Controllers = require('../controllers/Controllers');

driverRouter.get('/', Controllers.getDrivers);
driverRouter.post('/', Controllers.postDriver);

deliveryRouter.post('/', Controllers.postDelivery);

clientRouter.get('/', Controllers.getClients);
clientRouter.post('/', Controllers.postClient);

module.exports = {
  driverRouter,
  deliveryRouter,
  clientRouter
}

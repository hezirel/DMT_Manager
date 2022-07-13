const express = require('express');
const driverRouter = express.Router();
const deliveryRouter = express.Router();
const clientRouter = express.Router();
const transportsRouter = express.Router();

const Controllers = require('../controllers/Controllers');

driverRouter.get('/get', Controllers.getDrivers);
driverRouter.post('/add', Controllers.postDriver);

transportsRouter.post('/add', Controllers.postTransport);

deliveryRouter.get('/', Controllers.getDeliveries);

clientRouter.get('/get', Controllers.getClients);
clientRouter.post('/add', Controllers.postClient);
clientRouter.post("/list", Controllers.getClientLocations);
clientRouter.post("/orders", Controllers.getClientOrders);

module.exports = {
  driverRouter,
  deliveryRouter,
  clientRouter,
  transportsRouter
}

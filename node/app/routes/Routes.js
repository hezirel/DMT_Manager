const express = require('express');
const driverRouter = express.Router();
const deliveryRouter = express.Router();
const clientRouter = express.Router();
const transportsRouter = express.Router();

const Controllers = require('../controllers/Controllers');

driverRouter.post('/add', Controllers.postDriver);
driverRouter.get('/get', Controllers.getDrivers);

clientRouter.post('/add', Controllers.postClient);
clientRouter.get('/get', Controllers.getClients);
clientRouter.post('/list', Controllers.getClientLocations);

transportsRouter.post('/add', Controllers.postTransport);
deliveryRouter.get('/', Controllers.getDeliveries);


module.exports = {
  driverRouter,
  deliveryRouter,
  clientRouter,
  transportsRouter
}

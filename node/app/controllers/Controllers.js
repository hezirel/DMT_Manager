const dbServices = require('../services/Services')

const driverController = require('./Driver');
const clientController = require('./Client');
const transporterController = require('./Transport');


module.exports = {
  getDrivers: driverController.getDrivers,
  postDriver: driverController.postDriver,
  postClient: clientController.postClient,
  getClients: clientController.getClients,
  getClientLocations: clientController.getClientLocations,
  getParcels: transporterController.getParcels,
  postTransport: transporterController.postTransport,
}

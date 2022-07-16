const Models = require('../models/Models');
const DriverService = require('./Driver');
const ClientService = require('./Client');
const TransportService = require('./Transport');

module.exports = {
  postDriver: DriverService.postDriver,
  getDrivers: DriverService.getDrivers,
  postClient: ClientService.postClient,
  getClients: ClientService.getClients,
  getClientLocations: ClientService.getClientLocations,
  addTransport: TransportService.addTransport,
  getParcels: TransportService.getParcels
}

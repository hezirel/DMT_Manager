const dbServices = require('../services/Services')

const getDrivers = async (req, res) => {
    const drivers = await dbServices.getDrivers((err, drivers) => {
      if (err) return res.status(500).json({ message: err.message });
      else {res.json(drivers)}
    });
};

const postDriver = async (req, res) => {
    const drivers = await dbServices.postDriver(req.body, (err, driver) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(driver);
    });
}

const getClients = async (req, res) => {
    const clients = await dbServices.getClients((err, clients) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(clients);
    });
};

const getDeliveries = async (req, res) => {
    const deliveries = await dbServices.getDeliveries((err, deliveries) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.render('deliveries', {del: deliveries});
    });
  };

const postClient = async (req, res) => {
    const client = await dbServices.postClient(req.body, (err, client) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(client);
    });
};

const getClientLocations = async (req, res) => {
    const client = await dbServices.getClientLocations(req.body, (err, client) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(client);
    });
};

const getClientOrders = async (req, res) => {
    const client = await dbServices.getClientOrders(req.body, (err, client) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(client);
    });
};

const postTransport = async (req, res) => {
    const transport = await dbServices.addTransport({
      driver: req.body.driver,
      pickup: {
        client: req.body.pclient,
        city: req.body.pcity,
      },
      dropoff: {
        client: req.body.dclient,
        city: req.body.dcity,
      }
    }, (err, transport) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(transport);
    });
};

module.exports = {
  getDrivers,
  postDriver,
  postClient,
  getClients,
  getClientLocations,
  getClientOrders,
  getDeliveries,
  postTransport
}

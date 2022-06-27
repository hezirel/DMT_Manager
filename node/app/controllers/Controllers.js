const dbServices = require('../services/Services')

const getDrivers = async (req, res) => {
    const drivers = await dbServices.getDrivers((err, drivers) => {
      if (err) return res.status(500).json({ message: err.message });
      else {console.log(drivers); res.json(drivers)}
    });
};

const postDriver = async (req, res) => {
    const drivers = await dbServices.postDriver(req.body, (err, driver) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(driver);
    });
}

const postDelivery = async (req, res) => {
    const delivery = await dbServices.postDelivery(req.query, (err, delivery) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(delivery);
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
      else res.json(deliveries);
    });
  };

const postClient = async (req, res) => {
    const client = await dbServices.postClient(req.body, (err, client) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(client);
    });
};

module.exports = {
  getDrivers,
  postDriver,
  postDelivery,
  postClient,
  getClients,
  getDeliveries
}

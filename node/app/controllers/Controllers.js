const dbServices = require('../services/Services')

const postDriver = async (req, res) => {
    const drivers = await dbServices.postDriver(req.body, (err, driver) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(driver);
    });
}

const getDrivers = async (req, res) => {
    const drivers = await dbServices.getDrivers((err, drivers) => {
      if (err) return res.status(500).json({ message: err.message });
      else {res.json(drivers)}
    });
};

const postClient = async (req, res) => {
    const client = await dbServices.postClient(req.body, (err, client) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(client);
    });
};

const getClients = async (req, res) => {
    const clients = await dbServices.getClients((err, clients) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(clients);
    });
};

const getClientLocations = async (req, res) => {
    const client = await dbServices.getClientLocations(req.body, (err, client) => {
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

const getParcels = async (req, res) => {
    const deliveries = await dbServices.getParcels((err, deliveries) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.render('deliveries', {del: deliveries});
    });
  };

module.exports = {
  getDrivers,
  postDriver,
  postClient,
  getClients,
  getClientLocations,
  getParcels,
  postTransport
}

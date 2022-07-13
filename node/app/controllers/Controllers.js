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
    const delivery = await dbServices.postDelivery({
      pickup: {
        number: req.body.number,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
      },
      dropoff: {
        number: req.body.dnumber,
        street: req.body.dstreet,
        zip: req.body.dzip,
        city: req.body.dcity,
        country: req.body.dcountry,
      },
      driver: req.body.driver,
      client: req.body.client
    }, (err, delivery) => {
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
        country: req.body.pcountry,
        city: req.body.pcity,
        zip: req.body.pzip,
        street: req.body.pstreet,
        number: req.body.pnumber,
      },
      dropoff: {
        client: req.body.dclient,
        country: req.body.dcountry,
        city: req.body.dcity,
        zip: req.body.dzip,
        street: req.body.dstreet,
        number: req.body.dnumber,
      }
    }, (err, transport) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(transport);
    });
};

module.exports = {
  getDrivers,
  postDriver,
  postDelivery,
  postClient,
  getClients,
  getClientLocations,
  getClientOrders,
  getDeliveries,
  postTransport
}

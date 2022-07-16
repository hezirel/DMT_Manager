const dbServices = require('../services/Services')

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

module.exports = {
    postClient,
    getClients,
    getClientLocations
}

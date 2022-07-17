const dbServices = require('../services/Services')

const postTransport = async (req, res) => {
    const transport = await dbServices.addTransport({
      driver: req.body.driver,
      deliveries: [{
        pickup: {
          client: req.body.pclient,
          city: req.body.pcity,
        },
        dropoff: {
          client: req.body.dclient,
          city: req.body.dcity,
        }
      }]
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
  postTransport,
  getParcels
}

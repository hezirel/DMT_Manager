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

module.exports = {
    postDriver,
    getDrivers
}

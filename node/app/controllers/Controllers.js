const getDrivers = require('../services/Services').getDrivers;
const postDriver = require('../services/Services').postDriver;

const getDriversController = async (req, res) => {
    const drivers = await getDrivers((err, drivers) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(drivers);
    });
};

const postDriverController = async (req, res) => {
    const drivers = await postDriver(req.query, (err, driver) => {
      if (err) return res.status(500).json({ message: err.message });
      else res.json(driver);
    });
}

exports.getDriversController = getDriversController;
exports.postDriverController = postDriverController;

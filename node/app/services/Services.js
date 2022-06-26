const Driver = require('../models/Models');

const getDrivers = async (done) => {
  try {
    const drivers = await Driver.find({});
    done(null, drivers);
  } catch (err) {
    done(err, null);
  }
}

const postDriver = async (driver, done) => {
  try {
    const newDriver = new Driver(driver);
    await newDriver.save();
    done(null, newDriver);
  } catch (err) {
    done(err, null);
  }
}

exports.getDrivers = getDrivers;
exports.postDriver = postDriver;

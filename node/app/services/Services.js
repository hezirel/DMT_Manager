const Models = require('../models/Models');

const getDrivers = async (done) => {
  try {
    const drivers = await Models.Driver.find({});
    done(null, drivers);
  } catch (err) {
    done(err, null);
  }
}

const getClients = async (done) => {
  try {
    const clients = await Models.Client.find({});
    done(null, clients);
  } catch (err) {
    done(err, null);
  }
}

const getDeliveries = async (done) => {
  try {
    const deliveries = await Models.Delivery.find({});
    done(null, deliveries);
  } catch (err) {
    done(err, null);
  }
};

const postDriver = async (driver, done) => {
  try {
    const newDriver = new Models.Driver(driver);
    await newDriver.save();
    done(null, newDriver);
  } catch (err) {
    done(err, null);
  }
}

const postDelivery = async (delivery, done) => {
  try {
    const newDelivery = new Models.Delivery(delivery);
    await newDelivery.save();
    done(null, newDelivery);
  } catch (err) {
    done(err, null);
  }
};

const postClient = async (client, done) => {
  try {
    const newClient = new Models.Client(client);
    await newClient.save();
    done(null, newClient);
  } catch (err) {
    done(err, null);
  }
}

module.exports = {
  getDrivers,
  getClients,
  getDeliveries,
  postDriver,
  postClient,
  postDelivery
}

const Models = require('../models/Models');

const getDrivers = async (done) => {
  try {
    const drivers = await Models.Driver.find({}).select('-__v');
    done(null, drivers);
  } catch (err) {
    done(err, null);
  }
}

const getClients = async (done) => {
  try {
    const clients = await Models.Client.find({}).select('-__v');
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
    const pickup = new Models.PlaceTime({place: new Models.Location(delivery.pickup)});
    const dropoff = new Models.PlaceTime({place: new Models.Location(delivery.dropoff)});
    console.log(pickup.place, dropoff.place);
    const distance = await fetch(
      `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${pickup.place.number} ${pickup.place.street}, ${pickup.zip}, ${pickup.place.city}, ${pickup.place.country}&destinations=${dropoff.place.number} ${dropoff.place.street}, ${dropoff.place.zip}, ${dropoff.place.city}, ${dropoff.place.country}&key=TEja4AaETIRVxoxebthxCdtVh7JlO`
    ).then(res => res.json());
    console.log(distance, distance.rows[0].elements[0].distance.text);
    const newDelivery = new Models.Delivery({
      driver: delivery.driver,
      client: delivery.client,
      distance: distance.rows[0].elements[0].distance.value
    });
    await newDelivery.save();
    done(null, newDelivery);
  } catch (err) {
    done(err, null);
  }
};

const postClient = async (client, done) => {
  try {
    const newClient = await Models.Client.findOneAndUpdate({clientid: client.clientid}, {$push: {locations: new Models.Location(client) }}, {new: true}).select('-__v') || new Models.Client({clientid: client.clientid, locations: new Models.Location(client)});
    await newClient.save();
    done(null, newClient);
  } catch (err) {
    done(err, null);
  }
}

const getClientLocations = async (client, done) => {
  try {
    const clientLocations = await Models.Client.findOne({clientid: client.clientid}).select('locations');
    done(null, clientLocations);
  } catch (err) {
    done(err, null);
  }
};

module.exports = {
  getDrivers,
  getClients,
  getDeliveries,
  postDriver,
  postClient,
  postDelivery,
  getClientLocations
}

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
    const deliveries = await Models.Transport.find({})
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

const getClientOrders = async (client, done) => {
  try {
    const target = await Models.Client.findOne({clientid: client.clientid});
    const clientOrders = await Models.Delivery.find({client: target._id}).select('-__v');
    done(null, {clientOrders, totalDistance: clientOrders.reduce((acc, cur) => acc + cur.distance, 0)/1000 + "km"});
  } catch (err) {
    done(err, null);
  }
};

const addTransport = async (transport, done) => {
  const pClient = await Models.Client.findOne({clientid: transport.pickup.client});
  const dClient = await Models.Client.findOne({clientid: transport.dropoff.client});
  const driver = await Models.Driver.findOne({name: transport.driver});
  try {
    const pickup = new Models.PlaceTime({
      place: new Models.Location(transport.pickup),
      client: pClient._id,
      type: 'pickup'
    });
    const dropoff = new Models.PlaceTime({
      place: new Models.Location(transport.dropoff),
      client: dClient._id,
      type: 'dropoff'
    });
    await pickup.save()
    await dropoff.save();
    const newTransport = new Models.Transport({
      driver: driver._id,
      pickup: pickup._id,
      dropoff: dropoff._id
    });

    console.log(newTransport);
    await newTransport.save();
    const t = await Models.Transport.findOne({ _id: newTransport._id }).select("driver pickup dropoff").populate({
      path: 'pickup dropoff',
      populate: {
        path: 'client',
        model: 'clients',
        select: 'clientid',
        path: 'place',
        model: 'locations'
      }
    });

    console.log(t);
    done(null, newTransport);
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
  getClientOrders,
  getClientLocations,
  addTransport
}

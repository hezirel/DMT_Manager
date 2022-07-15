const Models = require('../models/Models');

const postDriver = async (driver, done) => {
  try {
    const newDriver = new Models.Driver(driver);
    await newDriver.save();
    done(null, newDriver);
  } catch (err) {
    done(err, null);
  }
}

const getDrivers = async (done) => { try {
    const drivers = await Models.Driver.find({}).select("name").then((drivers) => drivers.map((driver) => driver));

    const deliveries = drivers.map(async (driver) => {
      const list = await Promise.resolve(
        Models.Transport.find({driver: driver._id})
        .select("deliveries -_id"))
        .then((list) => list.map((transport) => transport.deliveries))
        .then((list) => list.flat());
      return {
        name: driver.name,
        deliveries: list
      }
    });

    let res = await Promise.all(deliveries);

    const ser = res.map(async (driver) => {
      const livraisons = await Promise.resolve(
        Models.PlaceTime.find({_id: {$in: driver.deliveries}}).populate('place', 'country city label -_id').populate('client', 'name -_id').select('client type place -_id'));
      return {
        name: driver.name,
        count: livraisons.length,
        livraisons: livraisons
      }
    });
    const result = await Promise.all(ser);
    done(null, result);
  } catch (err) {
    done(err, null);
  }
}

const getClients = async (done) => {
  try {
    const clients = await Models.Client.find({}).select('name');
    done(null, clients);
  } catch (err) {
    done(err, null);
  }
}

const postClient = async (client, done) => {
  try {
    Models.Client.findOne({name: client.name}, async (err, res) => {
      if (res) {
      const update = await Models.Client.findOneAndUpdate({name: client.name}, { $push: {
        locations: await new Models.Location(client).save()
      }}, { new: true} ).populate('locations', 'country city label');
      done(null, update);
      } else {
      console.log('client not found');
      const newClient = await new Models.Client({
        name: client.name,
        locations: [await new Models.Location(client).save()]
      }).populate('locations', 'country city label').save();
      done(null, newClient);
      }});
  } catch (err) {
    done(err, null);
  }
}

const getClientLocations = async (client, done) => {
  try {
    const clientLocations = await Models.Client.findOne({name: client.name}).populate({
      path: 'locations',
      model: 'locations',
      select: 'country city label'
    });
    done(null, clientLocations);
  } catch (err) {
    done(err, null);
  }
};

const addTransport = async (transport, done) => {
  const fetchClient = (name, city) => Models.Client.findOne({name})
    .select('locations name')
    .populate('locations', 'country city label')
    .then((client) => ({client: client.name, clientid: client._id, location: client.locations.find((location) => location.city === city)}));

  const driver = await Models.Driver.findOne({name: transport.driver}).then((driver) => driver._id);
  const pClient = await fetchClient(transport.pickup.client, transport.pickup.city);
  const dClient = await fetchClient(transport.dropoff.client, transport.dropoff.city);

  const pickup = await new Models.PlaceTime({
    client: pClient.clientid,
    place: pClient.location._id,
    type: 'pickup'
  }).save();

  const dropoff = await new Models.PlaceTime({
    client: dClient.clientid,
    place: dClient.location._id,
    type: 'dropoff'
  }).save();

  const parcel = await new Models.Parcel({
    pickup: pickup._id,
    dropoff: dropoff._id
  }).save();

  const res = await new Models.Transport({
    driver: driver,
    deliveries: [parcel._id]
  }).save();

  done(null, res);
};

const getDeliveries = async (done) => {
  try {
    const transports = await Models.Transport.find({})
      .select("driver deliveries")
      .populate('driver', 'name -_id')
      .then((transports) => transports.map((transport) => {
        return {
          driver: transport.driver.name
        }
    }));

    console.log(transports);
    done(null, transports);
  } catch (err) {
    done(err, null);
  }
};


module.exports = {
  postDriver,
  getDrivers,
  postClient,
  getClients,
  getClientLocations,
  addTransport,
  getDeliveries,
}

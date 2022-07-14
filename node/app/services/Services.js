const Models = require('../models/Models');

const getDrivers = async (done) => {
  try {
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
    console.log(res);
    const ser = res.map(async (driver) => {
      const livraisons = await Promise.resolve(
        Models.PlaceTime.find({_id: {$in: driver.deliveries}}).populate('place', 'country city street label -_id').populate('client', 'clientid -_id').select('client type place -_id'));
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
    const clients = await Models.Client.find({}).select('clientid');
    console.log(clients);
    done(null, clients);
  } catch (err) {
    done(err, null);
  }
}

const getDeliveries = async (done) => {
  try {
    const deliveries = await Models.Transport.find({}).select("driver deliveries").populate('driver', 'name -_id').populate({
      path: 'deliveries',
      populate: {
        path: 'client',
        model: 'clients',
        select: 'clientid -_id'
      },
    }).populate({
        path: 'deliveries',
        populate: {
          path: 'place',
          model: 'locations',
          select: 'country city street -_id'
        }
      }).select('-_id');

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
    const newClient = await Models.Client.findOneAndUpdate({clientid: client.clientid}, {$push: {locations: await new Models.Location(client).save() }}, {new: true}).select('-__v') || new Models.Client({clientid: client.clientid, locations: await new Models.Location(client).save()});
    await newClient.save();
    done(null, newClient);
  } catch (err) {
    done(err, null);
  }
}

const getClientLocations = async (client, done) => {
  try {
    const clientLocations = await Models.Client.findOne({clientid: client.clientid}).populate({
      path: 'locations',
      model: 'locations',
      select: 'country city street label'
    });
    done(null, clientLocations);
  } catch (err) {
    done(err, null);
  }
};

const getClientOrders = async (client, done) => {
  try {
    const target = await Models.Client.findOne({clientid: client.clientid});
    const clientOrders = await Models.PlaceTime.find({client: target._id}).select("place type").populate({
      path: 'place',
      model: 'locations',
      select: 'country city label'
    });
    done(null, {clientOrders});
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
      place: await new Models.Location(transport.pickup).save(),
      client: pClient._id,
      type: 'pickup'
    });
    const dropoff = new Models.PlaceTime({
      place: await new Models.Location(transport.dropoff).save(),
      client: dClient._id,
      type: 'dropoff'
    });
    await pickup.save()
    await dropoff.save();
    const newTransport = new Models.Transport({
      driver: driver._id,
      deliveries: [pickup._id, dropoff._id]
    }).populate('deliveries', '-_id');

    await newTransport.save();
    console.log(newTransport);
    const t = await Models.Transport.findOne({ _id: newTransport._id }).select("driver deliveries").populate('driver', 'name -_id');
    const p = await Models.PlaceTime.find({ _id: { $in: t.deliveries } }).select("client type place -_id").populate('place', 'country city street label').populate('client', 'clientid');
    done(null, {driver: t.driver.name, livraisons: p});
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

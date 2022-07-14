const Models = require('../models/Models');

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
        Models.PlaceTime.find({_id: {$in: driver.deliveries}}).populate('place', 'country city label -_id').populate('client', 'clientid -_id').select('client type place -_id'));
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
    done(null, clients);
  } catch (err) {
    done(err, null);
  }
}

const getDeliveries = async (done) => {
  try {
    const transports = await Models.Transport.find({})
      .select("driver deliveries")
      .populate('driver', 'name -_id')
      .populate('deliveries', '-_id')
      .populate({
      path: 'deliveries',
      populate: {
        path: 'place',
        model: 'locations',
        select: 'country city label'
      }
    })
      .populate({
      path: 'deliveries',
      populate: {
        path: 'client',
        model: 'clients',
        select: 'clientid'
      },
      select: 'client type place date -_id'
    }).then((transports) => transports.map((transport) => ({
        driver: transport.driver.name,
        pickup: {
          client: transport.deliveries[0].client.clientid,
          country: transport.deliveries[0].place.country,
          city: transport.deliveries[0].place.city,
          label: transport.deliveries[0].place.label,
          date: transport.deliveries[0].date.toISOString().split('T')[0].split('-').reverse().join('/')
        },
        dropoff: {
          client: transport.deliveries[1].client.clientid,
          country: transport.deliveries[1].place.country,
          city: transport.deliveries[1].place.city,
          label: transport.deliveries[1].place.label,
          date: transport.deliveries[1].date.toISOString().split('T')[0].split('-').reverse().join('/')
        }
      })));


    done(null, transports);
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
    Models.Client.findOne({clientid: client.clientid}, async (err, res) => {
      if (res) {
      const update = await Models.Client.findOneAndUpdate({clientid: client.clientid}, { $push: {
        locations: await new Models.Location(client).save()
      }}, { new: true} ).populate('locations', 'country city label');
      done(null, update);
      } else {
      console.log('client not found');
      const newClient = await new Models.Client({
        clientid: client.clientid,
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
    const clientLocations = await Models.Client.findOne({clientid: client.clientid}).populate({
      path: 'locations',
      model: 'locations',
      select: 'country city label'
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
  const pClient = await Models.Client.findOne({clientid: transport.pickup.client}).populate({
      path: 'locations',
      model: 'locations',
      select: 'country city label'
    }).then((client) => ({
      clientid: client._id,
      location: client.locations.find((location) => location.city == transport.pickup.city)
    }));

  const dClient = await Models.Client.findOne({clientid: transport.dropoff.client}).populate({
      path: 'locations',
      model: 'locations',
      select: 'country city label'
    }).then((client) => ({
      clientid: client._id,
      location: client.locations.find((location) => location.city == transport.dropoff.city)
    }));

  const driver = await Models.Driver.findOne({name: transport.driver});

  try {
    const pickup = new Models.PlaceTime({
      place: pClient.location._id,
      client: pClient.clientid,
      type: 'pickup'
    }).save().then((res) => res);
    const dropoff = new Models.PlaceTime({
      place: dClient.location._id,
      client: dClient.clientid,
      type: 'dropoff'
    }).save().then((res) => res);

    const r = await Promise.all([pickup, dropoff]);
    const res = await r.map((res) => res._id);
    const newTransport = new Models.Transport({
      driver: driver._id,
      deliveries: res
    }).populate('deliveries', '-_id');

    await newTransport.save();
    const t = await Models.Transport.findOne({ _id: newTransport._id }).select("driver deliveries").populate('driver', 'name -_id');
    const p = await Models.PlaceTime.find({ _id: { $in: t.deliveries } })
      .select("client type place date -_id")
      .populate('place', 'country city street label')
      .populate('client', 'clientid -_id');
    done(null, {driver: t.driver.name, transports: {
      pickup: p.filter((p) => p.type == 'pickup').map((p) => ({
        client: p.client.clientid,
        place: {
          country: p.place.country,
          city: p.place.city,
          label: p.place.label
        },
        date: p.date.toISOString().split('T')[0].split('-').reverse().join('/')
      })),
      dropoff: p.filter((p) => p.type == 'dropoff').map((p) => ({
        client: p.client.clientid,
        place: {
          country: p.place.country,
          city: p.place.city,
          label: p.place.label
        },
        date: p.date.toISOString().split('T')[0].split('-').reverse().join('/')
      }))
    }});
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

const Models = require('../models/Models');

const addTransport = async (transport, done) => {
  const fetchClient = (name, city) => Models.Client.findOne({name})
    .select('locations name')
    .populate('locations', 'country city label')
    .then((client) => ({client: client.name, clientid: client._id, location: client.locations.find((location) => location.city === city)}));

  const driver = await Models.Driver.findOne({name: transport.driver}).select('name _id').then((driver) => driver._id);
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

const getParcels = async (done) => {
  try {
    const transports = await Models.Transport.find({})
      .populate('driver')
      .populate({
        path: 'deliveries',
        model: 'parcels',
        populate: {
          path: 'pickup dropoff',
          model: 'placetimes'
        }
      })
      .populate({
        path: 'deliveries',
        populate: {
          path: 'pickup dropoff',
          model: 'placetimes'
        }
      })
      .populate({
        path: 'deliveries',
        populate: {
          path: 'pickup dropoff',
          populate: {
            path: 'place',
            model: 'locations',
            select: 'country city label'
          }
        }
      })
      .populate({
        path: 'deliveries',
        populate: {
          path: 'pickup dropoff',
          populate: {
            path: 'client',
            model: 'clients',
            select: 'name'
          }
        }
      })
      .then((transports) => transports.map((transport) => {
        console.log(transport.deliveries);
        return {
          driver: transport.driver.name,
          deliveries: {
            pickup: {
              client: transport.deliveries[0].pickup.client.name,
              place: {
                country: transport.deliveries[0].pickup.place.country,
                city: transport.deliveries[0].pickup.place.city,
                label: transport.deliveries[0].pickup.place.label
              },
              date: new Date(transport.deliveries[0].pickup.date).toISOString().split('T')[0].split('-').reverse().join('-')
            },
            dropoff: {
              client: transport.deliveries[0].dropoff.client.name,
              place: {
                country: transport.deliveries[0].dropoff.place.country,
                city: transport.deliveries[0].dropoff.place.city,
                label: transport.deliveries[0].dropoff.place.label
              },
              date: new Date(transport.deliveries[0].dropoff.date).toISOString().split('T')[0].split('-').reverse().join('-')
            },
          }
        }
      }));
    done(null, transports);
  } catch (err) {
    done(err, null);
  }
};

module.exports = {
  addTransport,
  getParcels
}

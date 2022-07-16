const Models = require('../models/Models');

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

module.exports = {
  getClients,
  postClient,
  getClientLocations
}

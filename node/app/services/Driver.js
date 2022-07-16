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

const getDrivers = async (done) => { 
  try {
    const drivers = await Models.Driver.find({}).select("name").then((drivers) => drivers.map((driver) => driver));

    const deliveries = drivers.map(async (driver) => {
      const list = [];
      const deliveries = await Models.Transport.find({driver: driver._id});
      deliveries.forEach((delivery) => {
        list.push(delivery.deliveries);
      });

      const parcels = await Models.Parcel.find({_id: {$in: list}})
        .populate({
          path: 'pickup dropoff',
          model: 'placetimes',
        })
        .populate({
          path: 'pickup dropoff',
          populate: {
            path: 'client',
            model: 'clients',
            select: 'name'
          }
        })
        .populate({
          path: 'pickup dropoff',
          populate: {
            path: 'place',
            model: 'locations',
          }
        })
        .then((parcels) => parcels.map((parcel) => {
          return {
            pickup: {
              client: parcel.pickup.client.name,
              place: {
                country: parcel.pickup.place.country,
                city: parcel.pickup.place.city,
                label: parcel.pickup.place.label
              }
            },
            dropoff: {
              client: parcel.dropoff.client.name,
              place: {
                country: parcel.dropoff.place.country,
                city: parcel.dropoff.place.city,
                label: parcel.dropoff.place.label
              }
            }
          }
        }));
      return {
        driver: driver.name,
        deliveries: parcels
      }
    });

    let res = await Promise.all(deliveries);

    const result = res.map((driver) => ({
      driver: driver.driver,
      count: driver.deliveries.length,
      deliveries: driver.deliveries
    }));
    done(null, result);
  } catch (err) {
    done(err, null);
  }
}

module.exports = {
  postDriver,
  getDrivers
}

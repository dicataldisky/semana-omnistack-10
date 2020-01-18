const Dev = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(req, res) {
    const { latitude, longitude, techs } = req.query;

    // Search Devs on 10KM radius
    // Filter By devs by techs

    const techsArray = parseStringAsArray(techs);
    const devs = await Dev.find({
      techs: {
        $in: techsArray, // Mongo operators
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 100000, // Distance in meters
        },
      },
    });

    return res.json({ devs });
  },
};

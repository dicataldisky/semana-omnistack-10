const axios = require('axios');
const Dev = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');
// index, show, store, update, destroy

module.exports = {
  async index(__, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const response = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = response.data;

      const techArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techArray,
        location,
      });

      // Filter socket connections where distance > 10km and new dev have 1 tecs searched by other users
      const sendSocketMessageTo = findConnections(
        {
          latitude,
          longitude,
        },
        techArray
      );
      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return res.json(dev);
  },
};

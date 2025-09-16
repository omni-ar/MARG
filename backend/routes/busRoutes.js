const express = require('express');
const Bus = require('../models/bus.model');

module.exports = (io) => {
  const router = express.Router();

  // GET all buses
  router.get('/', async (req, res) => {
    const buses = await Bus.find().populate('driverId routeId');
    res.json(buses);
  });

  // POST new bus
  router.post('/', async (req, res) => {
    try {
      const bus = new Bus(req.body);
      await bus.save();
      res.json(bus);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Update bus location (emit via Socket.IO)
  router.post('/:busId/location', async (req, res) => {
    const { lat, lng } = req.body;
    try {
      const bus = await Bus.findOneAndUpdate(
        { busId: req.params.busId },
        { currentLocation: { type: 'Point', coordinates: [lng, lat] }, lastUpdated: Date.now() },
        { new: true }
      );
      io.emit('busLocationUpdate', bus); // real-time update
      res.json(bus);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};

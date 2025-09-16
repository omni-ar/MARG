const express = require('express');
const TripHistory = require('../models/tripHistory.model');
const router = express.Router();

router.get('/', async (req, res) => {
  const trips = await TripHistory.find().populate('busId routeId passengers');
  res.json(trips);
});

router.post('/', async (req, res) => {
  try {
    const trip = new TripHistory(req.body);
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

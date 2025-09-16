const express = require('express');
const Route = require('../models/route.model');
const router = express.Router();

router.get('/', async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
});

router.post('/', async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.json(route);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

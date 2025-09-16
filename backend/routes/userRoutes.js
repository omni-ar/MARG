const express = require('express');
const User = require('../models/user.model');
const router = express.Router();

// GET all users (optional role filter)
router.get('/', async (req, res) => {
  const role = req.query.role;
  const users = role ? await User.find({ role }) : await User.find();
  res.json(users);
});

// POST new user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

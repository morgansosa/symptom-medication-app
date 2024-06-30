// src/routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register User
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser.id }, process.env.JWT_SECRET, { expiresIn: 3600 });

    res.json({
      token,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 3600 });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  const { username, email } = req.body;

  // Build profile object
  const profileFields = {};
  if (username) profileFields.username = username;
  if (email) profileFields.email = email;

  try {
    // Check if the new email already exists in another user
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }

    let user = await User.findById(req.user.id);

    if (user) {
      // Update
      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: profileFields },
        { new: true }
      ).select('-password');

      return res.json(user);
    }

    res.status(404).json({ msg: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

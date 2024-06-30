// src/routes/symptoms.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Symptom = require('../models/Symptom');

// Log Symptom
router.post('/', auth, async (req, res) => {
  const { description, severity } = req.body;
  try {
    const newSymptom = new Symptom({
      user: req.user.id,
      description,
      severity,
    });

    const symptom = await newSymptom.save();
    res.json(symptom);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all symptoms for a user
router.get('/', auth, async (req, res) => {
  try {
    const symptoms = await Symptom.find({ user: req.user.id });
    res.json(symptoms);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update Symptom
router.put('/:id', auth, async (req, res) => {
  const { description, severity } = req.body;
  try {
    let symptom = await Symptom.findById(req.params.id);
    if (!symptom) return res.status(404).json({ msg: 'Symptom not found' });

    // Ensure the symptom belongs to the user
    if (symptom.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    symptom = await Symptom.findByIdAndUpdate(
      req.params.id,
      { $set: { description, severity } },
      { new: true }
    );

    res.json(symptom);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// Delete Symptom
router.delete('/:id', auth, async (req, res) => {
  try {
    let symptom = await Symptom.findById(req.params.id);
    if (!symptom) {
      console.error('Symptom not found');
      return res.status(404).json({ msg: 'Symptom not found' });
    }

    // Ensure the symptom belongs to the user
    if (symptom.user.toString() !== req.user.id) {
      console.error('Not authorized to delete this symptom');
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Symptom.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Symptom removed' });
  } catch (err) {
    console.error('Error deleting symptom:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

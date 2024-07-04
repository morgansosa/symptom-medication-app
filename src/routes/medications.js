// path: src/routes/medications.js

const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Medication = require('../models/Medication');

const router = express.Router();

// Fetch medication information from OpenFDA
const fetchMedicationInfo = async (name) => {
  try {
    const response = await axios.get('https://api.fda.gov/drug/label.json', {
      params: {
        search: `openfda.generic_name:"${name}" OR openfda.brand_name:"${name}"`,
        limit: 10
      }
    });
    const results = response.data.results.map(result => ({
      name: result.openfda.brand_name ? result.openfda.brand_name[0] : result.openfda.generic_name[0],
      generic_name: result.openfda.generic_name ? result.openfda.generic_name[0] : '',
      manufacturer: result.openfda.manufacturer_name ? result.openfda.manufacturer_name[0] : ''
    }));
    return results;
  } catch (error) {
    console.error('Error fetching medication info from OpenFDA:', error);
    throw error;
  }
};

// Fetch suggestions for medication names
router.get('/suggestions', auth, async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get('https://api.fda.gov/drug/label.json', {
      params: {
        search: `openfda.generic_name:*${query}* OR openfda.brand_name:*${query}* OR openfda.generic_name:*${query}~ OR openfda.brand_name:*${query}~`,
        limit: 10
      }
    });

    const suggestions = response.data.results
      .map(result => ({
        name: result.openfda.brand_name ? result.openfda.brand_name[0] : result.openfda.generic_name[0]
      }))
      .filter((value, index, self) => index === self.findIndex((t) => t.name === value.name)); // Remove duplicates

    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching medication suggestions from OpenFDA:', error);
    res.status(500).send('Server Error');
  }
});

// Add new medication
router.post('/', auth, async (req, res) => {
  const { name, dosage, frequency, startDate, endDate, notes, reminders, quantity, refills } = req.body;

  try {
    const medicationInfo = await fetchMedicationInfo(name);
    const newMedication = new Medication({
      name: medicationInfo.length ? medicationInfo[0].name : name,
      dosage,
      frequency,
      startDate,
      endDate,
      notes,
      reminders,
      quantity,
      refills
    });

    const medication = await newMedication.save();
    res.json(medication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Fetch all medications
router.get('/', auth, async (req, res) => {
  try {
    const medications = await Medication.find();
    res.json(medications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update medication
router.put('/:id', auth, async (req, res) => {
  const { name, dosage, frequency, startDate, endDate, notes, reminders, quantity, refills } = req.body;

  try {
    let medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({ msg: 'Medication not found' });
    }

    medication = await Medication.findByIdAndUpdate(
      req.params.id,
      { $set: { name, dosage, frequency, startDate, endDate, notes, reminders, quantity, refills } },
      { new: true }
    );

    res.json(medication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete medication
router.delete('/:id', auth, async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({ msg: 'Medication not found' });
    }

    await Medication.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Medication removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Set reminder time for a medication
router.put('/set-reminder/:id', auth, async (req, res) => {
  const { reminderTime } = req.body;
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ msg: 'Medication not found' });
    }
    medication.reminderTime = reminderTime;
    await medication.save();
    res.json(medication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Mark medication as taken
router.put('/taken/:id', auth, async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ msg: 'Medication not found' });
    }
    medication.quantity -= 1;
    medication.takenDates.push(new Date());
    await medication.save();
    res.json(medication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

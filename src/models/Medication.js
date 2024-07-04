// path: src/models/Medication.js

const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  notes: { type: String },
  reminders: { type: Boolean, default: false },
  quantity: { type: Number, required: true },
  refills: { type: Number, required: true },
  takenDates: [{ type: Date }],
  reminderTime: { type: String }
});

module.exports = mongoose.model('Medication', MedicationSchema);

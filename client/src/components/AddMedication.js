// path: client/src/components/AddMedication.js

import React, { useState } from 'react';
import axios from 'axios';

const AddMedication = ({ showNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0], // Default to today's date
    endDate: '',
    notes: '',
    reminders: false,
    reminderTimes: [], // Start with an empty array
    quantity: '',
    refills: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      reminders: e.target.checked,
      reminderTimes: e.target.checked ? [{ hour: '08', minute: '00', period: 'AM' }] : [] // Start with a single default time or empty array
    });
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const handleReminderChange = (index, field, value) => {
    const newReminderTimes = [...formData.reminderTimes];
    if (field === 'minute') {
      // Ensure minutes are in 15-minute increments
      value = Math.round(value / 15) * 15;
      if (value >= 60) value = 0;
    }
    newReminderTimes[index] = { ...newReminderTimes[index], [field]: formatTime(value) };
    setFormData({ ...formData, reminderTimes: newReminderTimes });
  };

  const handleAddReminder = () => {
    setFormData({
      ...formData,
      reminderTimes: [...formData.reminderTimes, { hour: '08', minute: '00', period: 'AM' }] // Add default time for each new reminder
    });
  };

  const handleRemoveReminder = (index) => {
    const newReminderTimes = formData.reminderTimes.filter((_, i) => i !== index);
    setFormData({ ...formData, reminderTimes: newReminderTimes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/medications', formData, {
        headers: { 'x-auth-token': token },
      });
      showNotification('Medication added successfully!', 'success');
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: '',
        reminders: false,
        reminderTimes: [],
        quantity: '',
        refills: ''
      });
    } catch (err) {
      console.error('Failed to add medication', err);
      showNotification('Failed to add medication. Please try again.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <strong>Name:</strong>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          <strong>Dosage:</strong>
          <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          <strong>Frequency:</strong>
          <input type="text" name="frequency" value={formData.frequency} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          <strong>Start Date:</strong>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          <strong>End Date:</strong>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          <strong>Notes:</strong>
          <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
        </label>
      </div>
      <div>
        <label>
          <strong>Reminders:</strong>
          <input type="checkbox" name="reminders" checked={formData.reminders} onChange={handleCheckboxChange} />
        </label>
      </div>
      {formData.reminders && (
        <>
          {formData.reminderTimes.map((time, index) => (
            <div key={index}>
              <label>
                <strong>Reminder Time {index + 1}:</strong>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={time.hour}
                  onChange={(e) => handleReminderChange(index, 'hour', e.target.value)}
                />
                :
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="15"
                  value={time.minute}
                  onChange={(e) => handleReminderChange(index, 'minute', e.target.value)}
                />
                <select
                  value={time.period}
                  onChange={(e) => handleReminderChange(index, 'period', e.target.value)}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
                <button type="button" onClick={() => handleRemoveReminder(index)}>Remove</button>
              </label>
            </div>
          ))}
          <button type="button" onClick={handleAddReminder}>Add Reminder Time</button>
        </>
      )}
      <div>
        <label>
          <strong>Quantity:</strong>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          <strong>Refills:</strong>
          <input type="number" name="refills" value={formData.refills} onChange={handleChange} />
        </label>
      </div>
      <button type="submit">Add Medication</button>
    </form>
  );
};

export default AddMedication;

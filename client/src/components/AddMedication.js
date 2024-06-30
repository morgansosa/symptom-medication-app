// path: client/src/components/AddMedication.js

import React, { useState } from 'react';
import axios from 'axios';

const AddMedication = ({ showNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: '',
    reminders: false,
    quantity: '',
    refills: ''
  });
  const [suggestions, setSuggestions] = useState([]);

  const { name, dosage, frequency, startDate, endDate, notes, reminders, quantity, refills } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const fetchSuggestions = async (query) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/medications/suggestions?query=${encodeURIComponent(query)}`, {
        headers: { 'x-auth-token': token },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error('Failed to fetch suggestions', err);
      showNotification('Failed to fetch suggestions. Please try again.', 'error');
    }
  };

  const onNameChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
    if (e.target.value.length > 2) {
      fetchSuggestions(e.target.value);
    } else {
      setSuggestions([]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/medications', formData, {
        headers: { 'x-auth-token': token },
      });

      showNotification('Medication added successfully!', 'success');
      setFormData({ name: '', dosage: '', frequency: '', startDate: '', endDate: '', notes: '', reminders: false, quantity: '', refills: '' });
      setSuggestions([]);
    } catch (err) {
      console.error('Failed to add medication', err);
      showNotification('Failed to add medication. Please try again.', 'error');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={onNameChange}
        placeholder="Medication Name"
        required
        list="suggestions"
      />
      <datalist id="suggestions">
        {suggestions.map((suggestion, index) => (
          <option key={index} value={suggestion.name} />
        ))}
      </datalist>
      <input type="text" name="dosage" value={dosage} onChange={onChange} placeholder="Dosage" required />
      <input type="text" name="frequency" value={frequency} onChange={onChange} placeholder="Frequency" required />
      <input type="date" name="startDate" value={startDate} onChange={onChange} placeholder="Start Date" required />
      <input type="date" name="endDate" value={endDate} onChange={onChange} placeholder="End Date" />
      <input type="text" name="notes" value={notes} onChange={onChange} placeholder="Notes" />
      <label>
        Reminders:
        <input type="checkbox" name="reminders" checked={reminders} onChange={(e) => setFormData({ ...formData, reminders: e.target.checked })} />
      </label>
      <input type="number" name="quantity" value={quantity} onChange={onChange} placeholder="Quantity" required />
      <input type="number" name="refills" value={refills} onChange={onChange} placeholder="Refills" required />
      <button type="submit">Add Medication</button>
    </form>
  );
};

export default AddMedication;

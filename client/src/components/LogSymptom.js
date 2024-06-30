// client/src/components/LogSymptom.js
import React, { useState } from 'react';
import axios from 'axios';

const LogSymptom = () => {
  const [formData, setFormData] = useState({
    description: '',
    severity: '',
  });

  const { description, severity } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/symptoms', formData, {
        headers: { 'x-auth-token': token },
      });
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="description" value={description} onChange={onChange} placeholder="Symptom Description" required />
      <input type="number" name="severity" value={severity} onChange={onChange} placeholder="Symptom Severity" required />
      <button type="submit">Log Symptom</button>
    </form>
  );
};

export default LogSymptom;

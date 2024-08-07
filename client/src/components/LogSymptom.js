// client/src/components/LogSymptom.js
import React, { useState } from 'react';
import axios from 'axios';

const LogSymptom = ({ showNotification }) => {
  const [formData, setFormData] = useState({
    description: '',
    severity: '',
    category: '',
  });

  const [loading, setLoading] = useState(false);
  const { description, severity, category } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const fetchCategoryFromGemini = async (description) => {
    try {
      setLoading(true);
      const res = await axios.post(
        'https://api.gemini.com/categorize', // This URL should match the actual endpoint for Gemini API categorization
        { description },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setFormData((prevData) => ({ ...prevData, category: res.data.category }));
    } catch (err) {
      console.error('Error fetching category', err);
      showNotification('Failed to fetch category. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/symptoms',
        formData,
        {
          headers: { 'x-auth-token': token },
        }
      );
      console.log(res.data);
      showNotification('Symptom logged successfully!', 'success');
      setFormData({ description: '', severity: '', category: '' });
    } catch (err) {
      console.error('Error logging symptom', err);
      showNotification('Failed to log symptom. Please try again.', 'error');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="description"
        value={description}
        onChange={onChange}
        placeholder="Symptom Description"
        required
        onBlur={() => fetchCategoryFromGemini(description)}
      />
      <input
        type="number"
        name="severity"
        value={severity}
        onChange={onChange}
        placeholder="Symptom Severity"
        required
        min="1"
        max="10"
      />
      {loading ? (
        <p>Loading category...</p>
      ) : (
        <input
          type="text"
          name="category"
          value={category}
          onChange={onChange}
          placeholder="Category"
        />
      )}
      <button type="submit">Log Symptom</button>
    </form>
  );
};

export default LogSymptom;

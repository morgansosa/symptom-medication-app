// client/src/components/EditSymptom.js
import React, { useState } from 'react';
import axios from 'axios';

const EditSymptom = ({ symptom, setSymptoms, symptoms }) => {
  const [formData, setFormData] = useState({
    description: symptom.description,
    severity: symptom.severity,
  });

  const { description, severity } = formData;
  const [isEditing, setIsEditing] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/symptoms/${symptom._id}`, formData, {
        headers: { 'x-auth-token': token },
      });
      setSymptoms(
        symptoms.map((s) => (s._id === symptom._id ? { ...s, description: res.data.description, severity: res.data.severity } : s))
      );
      setIsEditing(false);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="description"
            value={description}
            onChange={onChange}
            placeholder="Symptom Description"
            required
          />
          <input
            type="number"
            name="severity"
            value={severity}
            onChange={onChange}
            placeholder="Symptom Severity"
            required
          />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
    </div>
  );
};

export default EditSymptom;

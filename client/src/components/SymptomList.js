// client/src/components/SymptomList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditSymptom from './EditSymptom';

const SymptomList = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/symptoms', {
          headers: { 'x-auth-token': token },
        });
        setSymptoms(res.data);
      } catch (err) {
        setMessage(err.response.data.msg || 'Failed to fetch symptoms!');
      }
    };

    fetchSymptoms();
  }, []);

  const deleteSymptom = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Sending DELETE request for symptom ID:', id);
      const res = await axios.delete(`http://localhost:5000/api/symptoms/${id}`, {
        headers: { 'x-auth-token': token },
      });
      console.log('DELETE request successful, response data:', res.data);
      setSymptoms(symptoms.filter((symptom) => symptom._id !== id));
    } catch (err) {
      console.error('DELETE request failed:', err.response.data);
      setMessage(err.response.data.msg || 'Failed to delete symptom!');
    }
  };

  return (
    <div>
      <h2>Symptom List</h2>
      {message && <p>{message}</p>}
      <ul>
        {symptoms.map((symptom) => (
          <li key={symptom._id}>
            <strong>Description:</strong> {symptom.description} <br />
            <strong>Severity:</strong> {symptom.severity} <br />
            <strong>Date:</strong> {new Date(symptom.date).toLocaleString()}
            <br />
            <button onClick={() => deleteSymptom(symptom._id)}>Delete</button>
            <EditSymptom symptom={symptom} setSymptoms={setSymptoms} symptoms={symptoms} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SymptomList;

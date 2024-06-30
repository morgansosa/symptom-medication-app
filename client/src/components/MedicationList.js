// path: client/src/components/MedicationList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MedicationList = ({ showNotification }) => {
  const [medications, setMedications] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({ name: '', dosage: '', frequency: '', quantity: '', refills: '' });

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/medications', {
          headers: { 'x-auth-token': token },
        });
        setMedications(res.data);
      } catch (err) {
        console.error('Failed to fetch medications', err);
        showNotification('Failed to fetch medications. Please try again.', 'error');
      }
    };

    fetchMedications();
  }, [showNotification]);

  const handleMarkAsTaken = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/medications/taken/${id}`, {}, {
        headers: { 'x-auth-token': token },
      });
      setMedications(medications.map(med => (med._id === id ? res.data : med)));
      showNotification('Medication marked as taken!', 'success');
    } catch (err) {
      console.error('Failed to mark medication as taken', err);
      showNotification('Failed to mark medication as taken. Please try again.', 'error');
    }
  };

  const handleDeleteMedication = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/medications/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setMedications(medications.filter(med => med._id !== id));
      showNotification('Medication deleted!', 'success');
    } catch (err) {
      console.error('Failed to delete medication', err);
      showNotification('Failed to delete medication. Please try again.', 'error');
    }
  };

  const handleEditMedication = (med) => {
    setEditMode(med._id);
    setEditData(med);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/medications/${id}`, editData, {
        headers: { 'x-auth-token': token },
      });
      setMedications(medications.map(med => (med._id === id ? res.data : med)));
      setEditMode(null);
      showNotification('Medication updated!', 'success');
    } catch (err) {
      console.error('Failed to update medication', err);
      showNotification('Failed to update medication. Please try again.', 'error');
    }
  };

  return (
    <div>
      <h2>Medication List</h2>
      <ul>
        {medications.map(med => (
          <li key={med._id}>
            {editMode === med._id ? (
              <>
                <input name="name" value={editData.name} onChange={handleEditChange} />
                <input name="dosage" value={editData.dosage} onChange={handleEditChange} />
                <input name="frequency" value={editData.frequency} onChange={handleEditChange} />
                <input name="quantity" value={editData.quantity} onChange={handleEditChange} />
                <input name="refills" value={editData.refills} onChange={handleEditChange} />
                <button onClick={() => handleEditSubmit(med._id)}>Save</button>
                <button onClick={() => setEditMode(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {med.name}</p>
                <p><strong>Dosage:</strong> {med.dosage}</p>
                <p><strong>Frequency:</strong> {med.frequency}</p>
                <p><strong>Quantity:</strong> {med.quantity}</p>
                <p><strong>Refills:</strong> {med.refills}</p>
                <button onClick={() => handleMarkAsTaken(med._id)}>Mark as Taken</button>
                <button onClick={() => handleEditMedication(med)}>Edit</button>
                <button onClick={() => handleDeleteMedication(med._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicationList;

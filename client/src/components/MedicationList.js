// path: client/src/components/MedicationList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MedicationList = ({ showNotification }) => {
  const [medications, setMedications] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({ name: '', dosage: '', frequency: '', quantity: '', refills: '', startDate: '', endDate: '' });
  const [reminderEditMode, setReminderEditMode] = useState(null);
  const [reminderTimes, setReminderTimes] = useState([{ hour: '08', minute: '00', period: 'AM' }]);

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

  const handleSetReminder = (id) => {
    setReminderEditMode(id);
    const med = medications.find(med => med._id === id);
    setReminderTimes(med.reminderTimes && med.reminderTimes.length > 0 ? med.reminderTimes : [{ hour: '08', minute: '00', period: 'AM' }]);
  };

  const handleReminderChange = (index, field, value) => {
    const newReminderTimes = [...reminderTimes];
    newReminderTimes[index] = { ...newReminderTimes[index], [field]: value };
    setReminderTimes(newReminderTimes);
  };

  const handleAddReminder = () => {
    setReminderTimes([...reminderTimes, { hour: '08', minute: '00', period: 'AM' }]);
  };

  const handleRemoveReminder = (index) => {
    const newReminderTimes = reminderTimes.filter((_, i) => i !== index);
    setReminderTimes(newReminderTimes);
  };

  const handleSaveReminder = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/medications/set-reminder/${id}`, { reminderTimes }, {
        headers: { 'x-auth-token': token },
      });
      setMedications(medications.map(med => (med._id === id ? res.data : med)));
      setReminderEditMode(null);
      showNotification('Reminder set!', 'success');
    } catch (err) {
      console.error('Failed to set reminder', err);
      showNotification('Failed to set reminder. Please try again.', 'error');
    }
  };

  return (
    <div>
      <h2>Medication List</h2>
      <ul>
        {medications.map(med => (
          <li key={med._id}>
            {editMode === med._id ? (
              <div>
                <p><strong>Name: </strong><input name="name" value={editData.name} onChange={handleEditChange} /></p>
                <p><strong>Dosage: </strong><input name="dosage" value={editData.dosage} onChange={handleEditChange} /></p>
                <p><strong>Frequency: </strong><input name="frequency" value={editData.frequency} onChange={handleEditChange} /></p>
                <p><strong>Quantity: </strong><input name="quantity" value={editData.quantity} onChange={handleEditChange} /></p>
                <p><strong>Refills: </strong><input name="refills" value={editData.refills} onChange={handleEditChange} /></p>
                <p><strong>Start Date: </strong><input name="startDate" type="date" value={editData.startDate} onChange={handleEditChange} /></p>
                <p><strong>End Date: </strong><input name="endDate" type="date" value={editData.endDate} onChange={handleEditChange} /></p>
                <button onClick={() => handleEditSubmit(med._id)}>Save</button>
                <button onClick={() => setEditMode(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <p><strong>Name: </strong> {med.name}</p>
                <p><strong>Dosage: </strong> {med.dosage}</p>
                <p><strong>Frequency: </strong> {med.frequency}</p>
                <p><strong>Quantity: </strong> {med.quantity}</p>
                <p><strong>Refills: </strong> {med.refills}</p>
                <p><strong>Start Date: </strong> {new Date(med.startDate).toLocaleDateString()}</p>
                <p><strong>End Date: </strong> {med.endDate ? new Date(med.endDate).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Reminders: </strong> 
                  {med.reminderTimes && med.reminderTimes.length > 0
                    ? med.reminderTimes.map((time, index) => (
                        <span key={index}>{time.hour}:{time.minute} {time.period} {index < med.reminderTimes.length - 1 && ', '}</span>
                      ))
                    : 'No reminders set'}
                </p>
                <button onClick={() => handleMarkAsTaken(med._id)}>Mark as Taken</button>
                <button onClick={() => handleEditMedication(med)}>Edit</button>
                <button onClick={() => handleDeleteMedication(med._id)}>Delete</button>
                {reminderEditMode === med._id ? (
                  <div>
                    {reminderTimes.map((time, index) => (
                      <div key={index}>
                        <label>
                          Reminder Time {index + 1}: 
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
                    <button onClick={() => handleSaveReminder(med._id)}>Save Reminder</button>
                    <button onClick={() => setReminderEditMode(null)}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => handleSetReminder(med._id)}>Set Reminder</button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicationList;

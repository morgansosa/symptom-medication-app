// client/src/components/SymptomLog.js
import React, { useState } from 'react';

const SymptomLog = () => {
  const [symptom, setSymptom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to log the symptom
    setSymptom('');
  };

  return (
    <div>
      <h1>Log Your Symptom</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          placeholder="Describe your symptom"
          required
        />
        <button type="submit">Log Symptom</button>
      </form>
    </div>
  );
};

export default SymptomLog;

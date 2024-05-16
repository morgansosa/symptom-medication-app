// client/src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Symptom & Medication Management App</h1>
      <Link to="/symptom-log">Log Symptoms</Link>
    </div>
  );
};

export default Home;

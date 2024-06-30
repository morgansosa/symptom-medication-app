// path: client/src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import SymptomList from './components/SymptomList';
import LogSymptom from './components/LogSymptom';
import Profile from './components/Profile';
import MedicationList from './components/MedicationList';
import AddMedication from './components/AddMedication';
import ProtectedRoute from './components/ProtectedRoute';
import Notification from './components/Notification';

const App = () => {
  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ message: '', type: '' })}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login showNotification={showNotification} />} />
          <Route path="/register" element={<Register showNotification={showNotification} />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile showNotification={showNotification} />} />
            <Route path="/log-symptom" element={<LogSymptom showNotification={showNotification} />} />
            <Route path="/symptom-list" element={<SymptomList showNotification={showNotification} />} />
            <Route path="/medications" element={<MedicationList showNotification={showNotification} />} />
            <Route path="/add-medication" element={<AddMedication showNotification={showNotification} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;

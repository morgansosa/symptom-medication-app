// path: client/src/components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1>Symptom Tracker</h1>
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li className="navbar-item">
              <Link to="/log-symptom">Log Symptom</Link>
            </li>
            <li className="navbar-item">
              <Link to="/symptom-list">Symptom List</Link>
            </li>
            <li className="navbar-item">
              <Link to="/medications">Medications</Link>
            </li>
            <li className="navbar-item">
              <Link to="/add-medication">Add Medication</Link>
            </li>
            <li className="navbar-item">
              <Link to="/profile">Profile</Link>
            </li>
            <li className="navbar-item">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item">
              <Link to="/login">Login</Link>
            </li>
            <li className="navbar-item">
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

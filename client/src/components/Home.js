// path: client/src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div>
      <h2>Welcome to Symptom Tracker</h2>
      {isAuthenticated ? (
        <p>You are logged in. Use the navigation bar to access different features.</p>
      ) : (
        <>
          <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to start tracking your symptoms.</p>
        </>
      )}
    </div>
  );
};

export default Home;

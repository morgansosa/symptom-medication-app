// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SymptomLog from './components/SymptomLog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/symptom-log" element={<SymptomLog />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import MobileDemo from './pages/MobileDemo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/demo" element={<MobileDemo />} />
      </Routes>
    </Router>
  );
}

export default App;

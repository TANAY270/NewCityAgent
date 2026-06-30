import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import MobileDemo from './pages/MobileDemo';
import SignalsPage from './pages/SignalsPage';

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', borderBottom: '1px solid black', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '15px', color: 'blue', textDecoration: 'underline' }}>Home / Onboarding</Link>
        <Link to="/demo" style={{ marginRight: '15px', color: 'blue', textDecoration: 'underline' }}>Mobile Demo Flow</Link>
        <Link to="/signals" style={{ color: 'blue', textDecoration: 'underline' }}>Signal Injection</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/demo" element={<MobileDemo />} />
        <Route path="/signals" element={<SignalsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

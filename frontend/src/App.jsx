import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import MobileDemo from './pages/MobileDemo';
import SignalsPage from './pages/SignalsPage';

function Navigation({ theme, toggleTheme }) {
  const location = useLocation();
  if (location.pathname === '/') return (
    <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}>
       <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</button>
    </div>
  ); 
  
  return (
    <nav style={{ padding: '15px 30px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--card-bg)' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
        <Link to="/demo" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>Mobile Demo Flow</Link>
        <Link to="/signals" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>Signal Injection</Link>
      </div>
      <button onClick={toggleTheme}>Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode</button>
    </nav>
  );
}

function App() {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <Router>
      <Navigation theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/demo" element={<MobileDemo />} />
        <Route path="/signals" element={<SignalsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

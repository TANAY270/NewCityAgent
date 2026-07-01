import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import MobileDemo from './pages/MobileDemo';
import SignalsPage from './pages/SignalsPage';
import { Moon, Sun, LogOut } from 'lucide-react';

function Navigation({ theme, toggleTheme }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/';

  return (
    <>
      {/* Top Black Header */}
      <div style={{ backgroundColor: '#0f0f0f', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '28px', filter: 'brightness(0) invert(1)' }} />
          <h2 style={{ margin: 0, color: 'white', fontSize: '20px', fontWeight: '800' }}>
            NewCity<span style={{ color: '#00e5ff', fontWeight: '400' }}>Agent</span>
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={toggleTheme} style={{ background: 'transparent', padding: '0', color: 'white', border: 'none' }} title="Toggle Dark Mode">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          {!isAuthPage && (
            <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              <LogOut size={16} /> Log Out
            </Link>
          )}
        </div>
      </div>

      {/* Stylish Tab Navigation */}
      {!isAuthPage && (
        <nav style={{ background: 'var(--nav-bg)', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link to="/demo" style={{ color: 'white', textDecoration: 'none', padding: '16px 0', borderBottom: location.pathname === '/demo' ? '3px solid #00e5ff' : '3px solid transparent', fontWeight: location.pathname === '/demo' ? 'bold' : 'normal', opacity: location.pathname === '/demo' ? 1 : 0.8 }}>Reactivation Simulator</Link>
          <Link to="/signals" style={{ color: 'white', textDecoration: 'none', padding: '16px 0', borderBottom: location.pathname === '/signals' ? '3px solid #00e5ff' : '3px solid transparent', fontWeight: location.pathname === '/signals' ? 'bold' : 'normal', opacity: location.pathname === '/signals' ? 1 : 0.8 }}>Intent Signals</Link>
        </nav>
      )}
    </>
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

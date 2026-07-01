import React, { useState } from 'react';
import { triggerScenario, resetState } from '../services/api';
import { RefreshCw, Zap, TrendingUp, Users, CheckCircle, CreditCard, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const [scenarioLoading, setScenarioLoading] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const showNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleTrigger = async (scenario) => {
    setScenarioLoading(scenario);
    try {
      await triggerScenario(scenario);
      showNotification(`Scenario triggered successfully! Check the Customer Simulator tab.`);
    } catch (e) {
      alert('Error triggering scenario. Is the backend running?');
    } finally {
      setScenarioLoading(null);
    }
  };

  const handleReset = async () => {
    setResetLoading(true);
    try {
      await resetState();
      showNotification('Backend demo state has been reset successfully.');
    } catch (e) {
      alert('Error resetting backend state.');
    } finally {
      setResetLoading(false);
    }
  };

  // Funnel steps data
  const funnelSteps = [
    { label: 'Signals Detected', value: '1,248', percentage: 100, color: 'var(--primary-purple)' },
    { label: 'Personalised Nudges Sent', value: '1,248', percentage: 100, color: 'var(--secondary-magenta)' },
    { label: 'Aadhaar OTP Verified', value: '914', percentage: 73.2, color: 'var(--highlight-cyan)' },
    { label: 'Remittances setup / Active accounts', value: '594', percentage: 47.6, color: '#10b981' }
  ];

  return (
    <div style={{ padding: '40px 80px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Toast Alert */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          zIndex: 9999,
          fontWeight: 'bold',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <CheckCircle size={18} /> {successMessage}
        </div>
      )}

      {/* Grid Layout Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' }}>
        
        {/* Left Column: Admin Control Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>Agent Control Panel</h2>
          
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: 'var(--text-primary)' }}>Trigger Relocation</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Simulate location signals arriving from external networks to trigger the AI agent.
              </p>
            </div>

            <button 
              onClick={() => handleTrigger('migrant_worker')}
              disabled={scenarioLoading !== null}
              style={{
                background: 'var(--secondary-magenta)',
                color: 'white',
                padding: '14px 20px',
                borderRadius: '8px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: scenarioLoading !== null ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: scenarioLoading !== null ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={16} /> 
              {scenarioLoading === 'migrant_worker' ? 'Triggering...' : 'Migrant Worker (ATM)'}
            </button>

            <button 
              onClick={() => handleTrigger('student')}
              disabled={scenarioLoading !== null}
              style={{
                background: 'var(--primary-purple)',
                color: 'white',
                padding: '14px 20px',
                borderRadius: '8px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: scenarioLoading !== null ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: scenarioLoading !== null ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={16} /> 
              {scenarioLoading === 'student' ? 'Triggering...' : 'Student (SIM Roaming)'}
            </button>

            <hr style={{ border: 'none', borderTop: '1px dashed var(--card-border)', margin: '10px 0' }} />

            <button 
              onClick={handleReset}
              disabled={resetLoading}
              style={{
                background: 'transparent',
                border: '1px solid var(--card-border)',
                color: 'var(--text-secondary)',
                padding: '10px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: resetLoading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={14} className={resetLoading ? 'spin-anim' : ''} />
              {resetLoading ? 'Resetting...' : 'Reset Demo State'}
            </button>
          </div>
        </div>

        {/* Right Column: Analytics & KPI Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Section Heading */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>Visual Analytics Dashboard</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
              Real-time Simulation Metrics
            </span>
          </div>

          {/* 4 KPI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            
            {/* KPI 1 */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Relocations Ingested</span>
                <TrendingUp size={16} color="var(--highlight-cyan)" />
              </div>
              <h4 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>1,248</h4>
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>+12.4% vs last month</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Dormant Reactivated</span>
                <Users size={16} color="var(--primary-purple)" />
              </div>
              <h4 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>914</h4>
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '6px' }}>
                <span>73.2% Conversion Rate</span>
              </div>
            </div>

            {/* KPI 3 */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Insta Accounts Opened</span>
                <CheckCircle size={16} color="var(--secondary-magenta)" />
              </div>
              <h4 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>324</h4>
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '6px' }}>
                <span>89.1% KYC Completion</span>
              </div>
            </div>

            {/* KPI 4 */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Remittance Volume</span>
                <CreditCard size={16} color="#10b981" />
              </div>
              <h4 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>₹45.2K</h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                <span>Zero service fee waived</span>
              </div>
            </div>

          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            {/* Chart 1: Relocations detected trend */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Relocation Detection Trend (Jan - Jun)
              </h3>
              
              <div style={{ width: '100%', height: '220px', display: 'flex', justifyContent: 'center' }}>
                <svg width="100%" height="100%" viewBox="0 0 500 220" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary-purple)" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="var(--primary-purple)" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="40" y1="30" x2="470" y2="30" stroke="var(--card-border)" strokeDasharray="3,3" />
                  <line x1="40" y1="75" x2="470" y2="75" stroke="var(--card-border)" strokeDasharray="3,3" />
                  <line x1="40" y1="120" x2="470" y2="120" stroke="var(--card-border)" strokeDasharray="3,3" />
                  <line x1="40" y1="165" x2="470" y2="165" stroke="var(--card-border)" strokeDasharray="3,3" />
                  <line x1="40" y1="180" x2="470" y2="180" stroke="var(--card-border)" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="30" y="34" fill="var(--text-secondary)" fontSize="10" textAnchor="end">400</text>
                  <text x="30" y="79" fill="var(--text-secondary)" fontSize="10" textAnchor="end">300</text>
                  <text x="30" y="124" fill="var(--text-secondary)" fontSize="10" textAnchor="end">200</text>
                  <text x="30" y="169" fill="var(--text-secondary)" fontSize="10" textAnchor="end">100</text>

                  {/* Area fill */}
                  <path d="M 40 180 L 40 165 L 120 150 L 205 110 L 290 85 L 375 60 L 470 30 L 470 180 Z" fill="url(#areaGrad)" />
                  
                  {/* Trend Line */}
                  <path d="M 40 165 L 120 150 L 205 110 L 290 85 L 375 60 L 470 30" fill="none" stroke="var(--primary-purple)" strokeWidth="3" />
                  
                  {/* Markers & Tooltips */}
                  <circle cx="40" cy="165" r="4" fill="white" stroke="var(--primary-purple)" strokeWidth="2" />
                  <circle cx="120" cy="150" r="4" fill="white" stroke="var(--primary-purple)" strokeWidth="2" />
                  <circle cx="205" cy="110" r="4" fill="white" stroke="var(--primary-purple)" strokeWidth="2" />
                  <circle cx="290" cy="85" r="4" fill="white" stroke="var(--primary-purple)" strokeWidth="2" />
                  <circle cx="375" cy="60" r="4" fill="white" stroke="var(--primary-purple)" strokeWidth="2" />
                  <circle cx="470" cy="30" r="4" fill="white" stroke="var(--primary-purple)" strokeWidth="2" />

                  {/* X Axis Labels */}
                  <text x="40" y="200" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Jan</text>
                  <text x="120" y="200" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Feb</text>
                  <text x="205" y="200" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Mar</text>
                  <text x="290" y="200" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Apr</text>
                  <text x="375" y="200" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">May</text>
                  <text x="470" y="200" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Jun</text>
                </svg>
              </div>
            </div>

            {/* Chart 2: Signal Ingestion breakdown */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
                Signal Sources Distribution (YTD)
              </h3>
              
              <div style={{ width: '100%', height: '220px', display: 'flex', justifyContent: 'center' }}>
                <svg width="100%" height="100%" viewBox="0 0 400 220" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="atmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary-purple)"/>
                      <stop offset="100%" stopColor="#3e1b7080"/>
                    </linearGradient>
                    <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--secondary-magenta)"/>
                      <stop offset="100%" stopColor="#b0185e80"/>
                    </linearGradient>
                    <linearGradient id="upiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--highlight-cyan)"/>
                      <stop offset="100%" stopColor="#00e5ff80"/>
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="50" y1="30" x2="370" y2="30" stroke="var(--card-border)" strokeDasharray="3,3" />
                  <line x1="50" y1="80" x2="370" y2="80" stroke="var(--card-border)" strokeDasharray="3,3" />
                  <line x1="50" y1="130" x2="370" y2="130" stroke="var(--card-border)" strokeDasharray="3,3" />
                  <line x1="50" y1="180" x2="370" y2="180" stroke="var(--card-border)" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="40" y="34" fill="var(--text-secondary)" fontSize="10" textAnchor="end">600</text>
                  <text x="40" y="84" fill="var(--text-secondary)" fontSize="10" textAnchor="end">400</text>
                  <text x="40" y="134" fill="var(--text-secondary)" fontSize="10" textAnchor="end">200</text>

                  {/* Bars with rounded top */}
                  <rect x="80" y="70" width="45" height="110" rx="4" fill="url(#atmGrad)" />
                  <rect x="180" y="45" width="45" height="135" rx="4" fill="url(#simGrad)" />
                  <rect x="280" y="95" width="45" height="85" rx="4" fill="url(#upiGrad)" />

                  {/* Bar Value Labels */}
                  <text x="102" y="60" fill="var(--text-primary)" fontSize="11" fontWeight="bold" textAnchor="middle">440</text>
                  <text x="202" y="35" fill="var(--text-primary)" fontSize="11" fontWeight="bold" textAnchor="middle">540</text>
                  <text x="302" y="85" fill="var(--text-primary)" fontSize="11" fontWeight="bold" textAnchor="middle">268</text>

                  {/* X Axis Labels */}
                  <text x="102" y="200" fill="var(--text-secondary)" fontSize="11" textAnchor="middle">ATM Swipe</text>
                  <text x="202" y="200" fill="var(--text-secondary)" fontSize="11" textAnchor="middle">SIM Roaming</text>
                  <text x="302" y="200" fill="var(--text-secondary)" fontSize="11" textAnchor="middle">UPI Location</text>
                </svg>
              </div>
            </div>

          </div>

          {/* Funnel Progress Chart */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
              Agentic Onboarding Funnel
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {funnelSteps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{step.label}</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>{step.value} ({step.percentage}%)</span>
                  </div>
                  <div style={{ height: '10px', background: 'var(--bg-primary)', borderRadius: '5px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                    <div style={{ width: `${step.percentage}%`, height: '100%', background: step.color, borderRadius: '5px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

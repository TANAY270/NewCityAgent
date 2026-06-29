import React, { useState, useEffect } from 'react';
import { triggerScenario, resetState, getState } from '../services/api';
import { RefreshCw, Zap, Send, Activity, Shield, Coins, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [signalForm, setSignalForm] = useState({ phone: '9876543210', source: 'ATM', city: 'Bengaluru' });
  const [signalResponse, setSignalResponse] = useState(null);
  
  // State for metrics computation
  const [users, setUsers] = useState([]);
  const [remittances, setRemittances] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchPlatformState = async () => {
    try {
      const data = await getState();
      if (data) {
        setUsers(data.users || []);
        setRemittances(data.remittances || []);
        setEvents(data.events || []);
      }
    } catch (e) {
      // silently ignore polling errors
    }
  };

  useEffect(() => {
    fetchPlatformState();
    const interval = setInterval(fetchPlatformState, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTrigger = async (scenario) => {
    setLoading(true);
    setSignalResponse(null);
    try {
      const res = await triggerScenario(scenario);
      if (res && res.error) {
        alert('Error: ' + res.error);
        return;
      }
      
      if (scenario === 'migrant_worker') {
        setSignalForm({ phone: '9876543210', source: 'ATM', city: 'Bengaluru' });
      } else if (scenario === 'student') {
        setSignalForm({ phone: '9876543211', source: 'SIM', city: 'Pune' });
      }
      
      fetchPlatformState();
    } catch (e) {
      alert('Error triggering scenario.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    setSignalResponse(null);
    try {
      await resetState();
      fetchPlatformState();
      alert('Database reset to seed state.');
    } catch (e) {
      alert('Error resetting state.');
    } finally {
      setLoading(false);
    }
  };

  const handleInjectSignal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSignalResponse(null);
    try {
      const res = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signalForm)
      });
      const data = await res.json();
      setSignalResponse(data);
      fetchPlatformState();
    } catch (e) {
      setSignalResponse({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillUser = (phone, defaultSource, defaultCity) => {
    setSignalForm({ phone, source: defaultSource, city: defaultCity });
  };

  // Compute metrics
  const activeCount = users.filter(u => u.accountStatus === 'active').length;
  const remittanceTotal = remittances.reduce((sum, r) => sum + Number(r.amount), 0);
  const privacyBlocks = events.filter(e => e.type === 'SIGNAL_BLOCKED').length;
  const conversionRate = users.length > 0 
    ? Math.round((users.filter(u => u.accountStatus === 'active').length / users.length) * 100) 
    : 0;

  return (
    <div style={{ padding: '40px 80px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <h2 style={{ color: 'var(--primary-purple)', marginBottom: '30px' }}>Agent Control Panel</h2>
      
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Left Column: Triggers and Ingress */}
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Scenario Trigger Card */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '25px',
            borderRadius: '8px',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--primary-purple)" />
              Scenario Studio
            </h3>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
              <div style={{ flex: 1, padding: '15px', border: '1px solid var(--card-border)', borderRadius: '6px', background: 'var(--bg-primary)' }}>
                <strong style={{ fontSize: '0.85rem' }}>Migrant Worker</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '6px 0 12px 0', lineHeight: '1.4' }}>
                  Simulates Ramesh moving Patna ➡️ Bengaluru. Triggers ATM geolocation. Reactivates dormant account.
                </p>
                <button 
                  onClick={() => handleTrigger('migrant_worker')}
                  disabled={loading}
                  style={{
                    background: 'var(--secondary-magenta)',
                    color: 'white',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    width: '100%',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Trigger Ramesh
                </button>
              </div>

              <div style={{ flex: 1, padding: '15px', border: '1px solid var(--card-border)', borderRadius: '6px', background: 'var(--bg-primary)' }}>
                <strong style={{ fontSize: '0.85rem' }}>Student Onboarding</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '6px 0 12px 0', lineHeight: '1.4' }}>
                  Simulates Priya moving Ranchi ➡️ Pune. Triggers SIM network roaming. Opens new student account.
                </p>
                <button 
                  onClick={() => handleTrigger('student')}
                  disabled={loading}
                  style={{
                    background: 'var(--primary-purple)',
                    color: 'white',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    width: '100%',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Trigger Priya
                </button>
              </div>
            </div>

            <button 
              onClick={handleReset}
              disabled={loading}
              style={{
                background: 'transparent',
                border: '1px solid var(--text-secondary)',
                color: 'var(--text-secondary)',
                padding: '10px',
                borderRadius: '4px',
                width: '100%',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} /> Reset Database State
            </button>
          </div>

          {/* Custom Signal Ingress Card */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '25px',
            borderRadius: '8px',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)'
          }}>
            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={18} color="var(--primary-purple)" />
              Custom Signal Injection
            </h3>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button 
                type="button"
                onClick={() => handleQuickFillUser('9876543210', 'ATM', 'Bengaluru')}
                style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'var(--bg-primary)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                Ramesh (ATM)
              </button>
              <button 
                type="button"
                onClick={() => handleQuickFillUser('9876543211', 'SIM', 'Pune')}
                style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'var(--bg-primary)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                Priya (SIM)
              </button>
              <button 
                type="button"
                onClick={() => handleQuickFillUser('9876543212', 'UPI', 'Mumbai')}
                style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'var(--bg-primary)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                Anil (UPI)
              </button>
            </div>

            <form onSubmit={handleInjectSignal}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phone Number</label>
                  <input 
                    type="text" 
                    value={signalForm.phone} 
                    onChange={e => setSignalForm({...signalForm, phone: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Target City</label>
                  <input 
                    type="text" 
                    value={signalForm.city} 
                    onChange={e => setSignalForm({...signalForm, city: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Signal Source</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['UPI', 'ATM', 'SIM'].map(src => (
                    <button
                      type="button"
                      key={src}
                      onClick={() => setSignalForm({...signalForm, source: src})}
                      style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '0.8rem',
                        border: signalForm.source === src ? '2px solid var(--primary-purple)' : '1px solid var(--card-border)',
                        background: signalForm.source === src ? '#3e1b7012' : 'transparent',
                        color: signalForm.source === src ? 'var(--primary-purple)' : 'var(--text-secondary)',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'var(--gradient-btn)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Inject Signal
              </button>
            </form>
            
            {signalResponse && (
              <div style={{
                marginTop: '15px',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                background: '#222',
                color: signalResponse.consentBlocked ? '#f87171' : signalResponse.cityChangeDetected ? '#fb923c' : '#4ade80',
                border: '1px solid #333'
              }}>
                {signalResponse.consentBlocked ? (
                  <div>❌ Permission Denied: Signal blocked by Privacy Ledger settings.</div>
                ) : signalResponse.cityChangeDetected ? (
                  <div>⚠️ Relocation Detected: Welcome Notification dispatched to YONO App.</div>
                ) : (
                  <div>✅ Signal ingested successfully (No city change detected).</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Platform Analytics */}
        <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: '5px 0' }}>Platform Analytics</h3>
          
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '20px', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#22c55e20', padding: '12px', borderRadius: '50%', color: '#22c55e' }}>
              <CheckCircle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Users</div>
              <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{activeCount} / {users.length}</strong>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '20px', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#b0185e20', padding: '12px', borderRadius: '50%', color: '#b0185e' }}>
              <Coins size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Remittances</div>
              <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>₹{remittanceTotal.toLocaleString()}</strong>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '20px', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#ef444420', padding: '12px', borderRadius: '50%', color: '#ef4444' }}>
              <Shield size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Privacy Intercepts</div>
              <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{privacyBlocks}</strong>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '20px', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#00a2e020', padding: '12px', borderRadius: '50%', color: '#00a2e0' }}>
              <Activity size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Onboarding Conversions</div>
              <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{conversionRate}%</strong>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
}

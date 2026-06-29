import React, { useState, useEffect } from 'react';
import { triggerScenario, resetState, getState } from '../services/api';
import { RefreshCw, Zap, Send, Activity, Shield, Coins, CheckCircle, HelpCircle } from 'lucide-react';
import MapSimulator from '../components/MapSimulator';



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

  const [helpSection, setHelpSection] = useState(null);

  const handleMapCityClick = (cityName) => {
    const activePhone = signalForm.phone || '9876543210';
    let source = 'UPI';
    if (activePhone === '9876543210') source = 'ATM';
    else if (activePhone === '9876543211') source = 'SIM';
    
    setSignalForm({
      phone: activePhone,
      source: source,
      city: cityName
    });
  };

  const helpDetails = {
    studio: {
      title: 'Scenario Studio - Relocation Detection',
      tech: 'Location Signal Processing Engine',
      desc: 'How location signals trigger customer outreach: The agent listens to event streams from UPI merchant payments, ATM logs, or SIM cell-tower handovers. If a transaction location differs from the customer\'s home branch state registry, it indicates a critical city change transition. Rather than continuous GPS tracking, the system relies on these transactional milestones to respect user privacy.'
    },
    ingress: {
      title: 'Custom Signal Ingress',
      tech: 'API Signal Gateway Switch',
      desc: 'Simulating integration with telecom and payment gateways: This panel simulates receiving transactional webhooks. For instance, when a customer taps their card at an ATM or initiates a local merchant UPI QR scan, the payment switch notifies NewCityAgent. The gateway instantly checks current consent policies before routing signals to the AI processing layer.'
    },
    analytics: {
      title: 'Platform Analytics',
      tech: 'Banking Performance Metrics',
      desc: 'Measuring business and compliance indicators: Displays key performance metrics. Onboarding Conversions show the share of identified relocated customers who successfully reactivated their accounts or opened new ones. Active Remittances shows the volume of funds safely processed through automated, recurring local accounts instead of informal cash channels.'
    },
    terminal: {
      title: 'Live System Event Stream',
      tech: 'Agent Audit Trace Ledger',
      desc: 'Audit logs and agent trace visibility: Tracks the exact processing path of the AI agent. Displays when a signal is received, when database lookups are performed, when the LLM generates customized outreach, and when messages are dispatched to the customer\'s app, giving compliance auditors clear traceability.'
    }
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
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="var(--primary-purple)" />
                Scenario Studio
              </span>
              <button 
                onClick={() => setHelpSection('studio')}
                style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                title="Learn about this technology"
              >
                <HelpCircle size={16} />
              </button>
            </h3>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
              <div style={{ flex: 1, padding: '15px', border: '1px solid var(--card-border)', borderRadius: '6px', background: 'var(--bg-primary)' }}>
                <strong style={{ fontSize: '0.85rem' }}>Migrant Worker</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '6px 0 12px 0', lineHeight: '1.4' }}>
                  Simulates Ramesh moving Patna to Bengaluru. Triggers ATM geolocation. Reactivates dormant account.
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
                  Simulates Priya moving Ranchi to Pune. Triggers SIM network roaming. Opens new student account.
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
            <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} color="var(--primary-purple)" />
                Custom Signal Injection
              </span>
              <button 
                onClick={() => setHelpSection('ingress')}
                style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                title="Learn about this technology"
              >
                <HelpCircle size={16} />
              </button>
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
                  <div>Permission Denied: Signal blocked by Privacy Ledger settings.</div>
                ) : signalResponse.cityChangeDetected ? (
                  <div>Relocation Detected: Welcome Notification dispatched to YONO App.</div>
                ) : (
                  <div>Signal ingested successfully (No city change detected).</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Map Simulator and Platform Analytics */}
        <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <MapSimulator users={users} onCityClick={handleMapCityClick} />

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '25px', boxShadow: 'var(--card-shadow)' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--primary-purple)" />
                Platform Analytics
              </span>
              <button 
                onClick={() => setHelpSection('analytics')}
                style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                title="Learn about this technology"
              >
                <HelpCircle size={16} />
              </button>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#22c55e20', padding: '12px', borderRadius: '50%', color: '#22c55e' }}>
                  <CheckCircle size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Users</div>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{activeCount} / {users.length}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#b0185e20', padding: '12px', borderRadius: '50%', color: '#b0185e' }}>
                  <Coins size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Remittances</div>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>₹{remittanceTotal.toLocaleString()}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: '#ef444420', padding: '12px', borderRadius: '50%', color: '#ef4444' }}>
                  <Shield size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Privacy Intercepts</div>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{privacyBlocks}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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

      </div>

      {/* Bottom Row: Live System Event Stream Terminal */}
      <div style={{ marginTop: '40px', background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '25px', boxShadow: 'var(--card-shadow)' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--primary-purple)" />
            Live System Event Stream
          </span>
          <button 
            onClick={() => setHelpSection('terminal')}
            style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            title="Learn about this technology"
          >
            <HelpCircle size={16} />
          </button>
        </h3>

        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          background: '#0c0d12',
          color: '#38bdf8',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #1e293b',
          height: '220px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {events.length === 0 ? (
            <div style={{ color: '#64748b', textAlign: 'center', marginTop: '80px' }}>No system events logged yet. Trigger a relocation to view execution path.</div>
          ) : (
            [...events].reverse().map((evt) => {
              const timeStr = new Date(evt.timestamp).toLocaleTimeString();
              let badgeColor = '#94a3b8';
              if (evt.type.includes('START') || evt.type.includes('SUCCESS') || evt.type.includes('TRANSACTION')) {
                badgeColor = '#34d399';
              } else if (evt.type.includes('ERROR') || evt.type.includes('BLOCKED') || evt.type.includes('WARNING')) {
                badgeColor = '#f87171';
              } else if (evt.type.includes('SIGNAL') || evt.type.includes('CITY')) {
                badgeColor = '#fb7185';
              } else if (evt.type.includes('LLM') || evt.type.includes('NOTIFICATION')) {
                badgeColor = '#c084fc';
              }

              return (
                <div key={evt.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b', flexShrink: 0 }}>[{timeStr}]</span>
                  <span style={{
                    background: `${badgeColor}20`,
                    color: badgeColor,
                    padding: '1px 6px',
                    borderRadius: '3px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                  }}>
                    {evt.type}
                  </span>
                  <span style={{ color: '#e2e8f0' }}>{evt.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Banker Explanation Modal */}
      {helpSection && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            color: 'var(--text-primary)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary-purple)' }}>{helpDetails[helpSection].title}</h3>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--highlight-cyan)', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '0.5px' }}>
              Underlying Technology: {helpDetails[helpSection].tech}
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '25px' }}>
              {helpDetails[helpSection].desc}
            </p>
            <button
              onClick={() => setHelpSection(null)}
              style={{
                width: '100%',
                background: 'var(--gradient-btn)',
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}

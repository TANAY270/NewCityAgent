import React, { useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

function HelpPopup({ title, content }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ background: 'transparent', padding: 0, color: 'var(--primary-color)' }}><HelpCircle size={18} /></button>
      {open && (
        <div className="popup-overlay" onClick={() => setOpen(false)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>{title}</h3>
              <X size={20} style={{ cursor: 'pointer' }} onClick={() => setOpen(false)} />
            </div>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{content}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function SignalsPage() {
  const [status, setStatus] = useState('');
  const [signals, setSignals] = useState([]);
  
  // Custom states for form
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const fetchData = async () => {
    try {
      const resSig = await fetch('/api/signals');
      const dataSig = await resSig.json();
      if (Array.isArray(dataSig)) setSignals(dataSig);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const evtSource = new EventSource('/api/signals/stream');
    evtSource.onmessage = (event) => {
      const newSignal = JSON.parse(event.data);
      setSignals((prev) => [newSignal, ...prev].slice(0, 20));
    };
    return () => evtSource.close();
  }, []);

  const sendSignal = async (type) => {
    if (!city) return alert("Please specify a city");
    try {
      await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal_type: type, location: city })
      });
      setStatus(`Signal Sent Successfully! (${type} in ${city})`);
      setTimeout(() => setStatus(''), 3000);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Reactivation Signal Injector</h1>
        <HelpPopup 
          title="Reactivation Signals" 
          content="These signals (UPI, ATM, SIM) are used to intelligently identify when a dormant customer has relocated, triggering the conversational onboarding flow."
        />
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Left Side: Form */}
        <div style={{ flex: 1, minWidth: '400px' }}>
          <div className="card">
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Inject Location Signal</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Phone Number</label>
              <input type="text" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g. 9876543210" />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>City</label>
              <input type="text" value={city} onChange={e=>setCity(e.target.value)} placeholder="Type or select city..." />
            </div>

            <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Signal Source (Click to Inject)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => sendSignal('UPI')} style={{ flex: 1, background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--primary-color)' }}>UPI</button>
              <button onClick={() => sendSignal('ATM')} style={{ flex: 1, background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--primary-color)' }}>ATM</button>
              <button onClick={() => sendSignal('SIM')} style={{ flex: 1, background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--primary-color)' }}>SIM</button>
            </div>

            {status && (
              <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#e6ffe6', color: '#166534', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center', fontWeight: 'bold' }}>
                {status}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Table */}
        <div style={{ flex: 1, minWidth: '400px' }}>
          <div className="card" style={{ height: '100%' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Response & Recent Signals</span>
              <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', backgroundColor: '#ecfdf5', padding: '4px 10px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                <span className="live-dot" style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                Live Stream Active
              </span>
            </h3>
            <div className="table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Phone (User ID)</th>
                    <th>Source</th>
                    <th>City</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {signals.map(s => (
                    <tr key={s.id}>
                      <td>{s.user_id || phone || 'N/A'}</td>
                      <td>{s.signal_type}</td>
                      <td>{s.location}</td>
                      <td>{new Date(s.timestamp).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                  {signals.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: 'center', color: '#6b7280' }}>No signals logged yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function SignalsPage() {
  const [status, setStatus] = useState('');
  const [signals, setSignals] = useState([]);

  const fetchSignals = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/signals');
      const data = await res.json();
      setSignals(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const sendSignal = async (type, location) => {
    try {
      await fetch('http://localhost:3000/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal_type: type, location })
      });
      setStatus(`Signal Sent Successfully! (${type})`);
      setTimeout(() => setStatus(''), 3000);
      fetchSignals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '40px' }}>
      
      <div style={{ flex: 1, maxWidth: '400px' }}>
        <h1>Signal Injection Dashboard</h1>
        <p>Simulate location changes to trigger the NewCityAgent logic. This logs directly to PostgreSQL.</p>

        {status && (
          <div style={{ border: '1px solid black', padding: '10px', margin: '20px 0', backgroundColor: '#e6ffe6' }}>
            <strong>{status}</strong>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
          <div style={{ border: '1px solid black', padding: '15px' }}>
            <h3>UPI Geolocation</h3>
            <p>Simulate a UPI payment at a Delhi Merchant.</p>
            <button onClick={() => sendSignal('UPI', 'Delhi')} style={{ width: '100%', padding: '10px' }}>Inject UPI Signal</button>
          </div>
          <div style={{ border: '1px solid black', padding: '15px' }}>
            <h3>ATM Geolocation</h3>
            <p>Simulate an ATM cash withdrawal in Mumbai.</p>
            <button onClick={() => sendSignal('ATM', 'Mumbai')} style={{ width: '100%', padding: '10px' }}>Inject ATM Signal</button>
          </div>
          <div style={{ border: '1px solid black', padding: '15px' }}>
            <h3>SIM Roaming</h3>
            <p>Simulate a telecom network roaming ping.</p>
            <button onClick={() => sendSignal('SIM Roaming', 'Bangalore')} style={{ width: '100%', padding: '10px' }}>Inject SIM Signal</button>
          </div>
        </div>
      </div>

      <div style={{ flex: 2 }}>
        <h2>Live Database Logs</h2>
        <div style={{ border: '1px solid black', height: '600px', overflowY: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid black', backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px' }}>ID</th>
                <th style={{ padding: '10px' }}>Type</th>
                <th style={{ padding: '10px' }}>Location</th>
                <th style={{ padding: '10px' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {signals.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={{ padding: '10px' }}>{s.id}</td>
                  <td style={{ padding: '10px' }}>{s.signal_type}</td>
                  <td style={{ padding: '10px' }}>{s.location}</td>
                  <td style={{ padding: '10px' }}>{new Date(s.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {signals.length === 0 && (
                <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No signals logged yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

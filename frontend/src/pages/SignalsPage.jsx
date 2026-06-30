import React, { useState, useEffect } from 'react';

export default function SignalsPage() {
  const [status, setStatus] = useState('');
  const [signals, setSignals] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const resSig = await fetch('/api/signals');
      const dataSig = await resSig.json();
      if (Array.isArray(dataSig)) setSignals(dataSig);

      const resUsr = await fetch('/api/users');
      const dataUsr = await resUsr.json();
      if (Array.isArray(dataUsr)) setUsers(dataUsr);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  const sendSignal = async (type, location) => {
    try {
      await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal_type: type, location })
      });
      setStatus(`Signal Sent Successfully! (${type})`);
      setTimeout(() => setStatus(''), 3000);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard & Signal Injection</h1>
      <p>Simulate location changes and view live database logs.</p>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', marginTop: '20px' }}>
        <div style={{ flex: 1, border: '1px solid black', padding: '15px', textAlign: 'center' }}>
          <h2>{users.length}</h2>
          <p>Total Users Tracked</p>
        </div>
        <div style={{ flex: 1, border: '1px solid black', padding: '15px', textAlign: 'center' }}>
          <h2>{signals.length}</h2>
          <p>Signals Processed</p>
        </div>
        <div style={{ flex: 1, border: '1px solid black', padding: '15px', textAlign: 'center' }}>
          <h2>{signals.length > 0 ? signals.length * 2 : 0}</h2>
          <p>Notifications Sent</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1, maxWidth: '300px' }}>
          <h3>Inject Location Signal</h3>
          {status && (
            <div style={{ border: '1px solid black', padding: '10px', margin: '20px 0', backgroundColor: '#e6ffe6' }}>
              <strong>{status}</strong>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            <div style={{ border: '1px solid black', padding: '15px' }}>
              <h4>UPI Geolocation</h4>
              <button onClick={() => sendSignal('UPI', 'Delhi')} style={{ width: '100%', padding: '10px', marginTop: '10px' }}>Simulate Delhi Payment</button>
            </div>
            <div style={{ border: '1px solid black', padding: '15px' }}>
              <h4>ATM Geolocation</h4>
              <button onClick={() => sendSignal('ATM', 'Mumbai')} style={{ width: '100%', padding: '10px', marginTop: '10px' }}>Simulate Mumbai ATM</button>
            </div>
            <div style={{ border: '1px solid black', padding: '15px' }}>
              <h4>SIM Roaming</h4>
              <button onClick={() => sendSignal('SIM Roaming', 'Bangalore')} style={{ width: '100%', padding: '10px', marginTop: '10px' }}>Simulate Bangalore Ping</button>
            </div>
          </div>
        </div>

        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <h3>Live Event Logs (Signals)</h3>
            <div style={{ border: '1px solid black', height: '250px', overflowY: 'auto', backgroundColor: '#1e1e1e', color: '#00ff00', fontFamily: 'monospace' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #444' }}>
                    <th style={{ padding: '10px' }}>Timestamp</th>
                    <th style={{ padding: '10px' }}>Type</th>
                    <th style={{ padding: '10px' }}>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {signals.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '10px' }}>[{new Date(s.timestamp).toLocaleTimeString()}]</td>
                      <td style={{ padding: '10px' }}>{s.signal_type}</td>
                      <td style={{ padding: '10px' }}>{s.location}</td>
                    </tr>
                  ))}
                  {signals.length === 0 && (
                    <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>Waiting for signals...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3>Registered Users</h3>
            <div style={{ border: '1px solid black', height: '250px', overflowY: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid black', backgroundColor: '#f0f0f0' }}>
                    <th style={{ padding: '10px' }}>Name</th>
                    <th style={{ padding: '10px' }}>Phone</th>
                    <th style={{ padding: '10px' }}>Persona</th>
                    <th style={{ padding: '10px' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #ccc' }}>
                      <td style={{ padding: '10px' }}>{u.name}</td>
                      <td style={{ padding: '10px' }}>{u.phone}</td>
                      <td style={{ padding: '10px', textTransform: 'capitalize' }}>{u.persona}</td>
                      <td style={{ padding: '10px' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No users registered yet.</td></tr>
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

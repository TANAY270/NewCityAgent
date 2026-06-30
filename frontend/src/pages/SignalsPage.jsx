import React, { useState } from 'react';

const InfoTooltip = ({ text }) => (
  <div className="tooltip-container">
    ?
    <span className="tooltip-text">{text}</span>
  </div>
);

export default function SignalsPage() {
  const [status, setStatus] = useState('');

  const sendSignal = (type) => {
    setStatus(`Signal Sent Successfully! (${type})`);
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>
        Signal Injection Simulator
        <InfoTooltip text="This simulates the location events that our agent monitors. In a real app, this data comes from backend integration." />
      </h1>
      
      <p>Simulate location changes to trigger the NewCityAgent logic.</p>

      {status && (
        <div style={{ border: '1px solid black', padding: '10px', margin: '20px 0', backgroundColor: '#e6ffe6' }}>
          <strong>{status}</strong>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', marginTop: '30px' }}>
        
        <div style={{ border: '1px solid black', padding: '15px' }}>
          <h3>UPI Geolocation</h3>
          <p>Simulate a UPI payment at a Delhi Merchant.</p>
          <button onClick={() => sendSignal('UPI - Delhi')} style={{ width: '100%' }}>Inject UPI Signal</button>
        </div>

        <div style={{ border: '1px solid black', padding: '15px' }}>
          <h3>ATM Geolocation</h3>
          <p>Simulate an ATM cash withdrawal in Mumbai.</p>
          <button onClick={() => sendSignal('ATM - Mumbai')} style={{ width: '100%' }}>Inject ATM Signal</button>
        </div>

        <div style={{ border: '1px solid black', padding: '15px' }}>
          <h3>SIM Roaming</h3>
          <p>Simulate a telecom network roaming ping (consent-based).</p>
          <button onClick={() => sendSignal('SIM Roaming')} style={{ width: '100%' }}>Inject SIM Signal</button>
        </div>

      </div>
    </div>
  );
}

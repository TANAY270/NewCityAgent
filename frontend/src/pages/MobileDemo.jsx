import React, { useState, useEffect } from 'react';

const InfoTooltip = ({ text }) => (
  <div className="tooltip-container">
    ?
    <span className="tooltip-text">{text}</span>
  </div>
);

export default function MobileDemo() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>
        Guided Demo Flow
        <InfoTooltip text="This simulates a user's mobile phone experience. The admin can see what the user sees when they receive relocation alerts." />
      </h1>

      <div style={{
        width: '375px',
        height: '667px',
        border: '2px solid black',
        margin: '20px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Status Bar */}
        <div style={{ 
          borderBottom: '1px solid black', 
          padding: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}>
          <span>{time.toLocaleTimeString()}</span>
          <span>{time.toLocaleDateString()} | 100% 🔋</span>
        </div>

        {/* Screen Content */}
        <div style={{ padding: '10px', flexGrow: 1 }}>
          <h2>Mobile Simulator</h2>
          <p>This is where the simulated app and notifications will appear.</p>
        </div>
      </div>
    </div>
  );
}

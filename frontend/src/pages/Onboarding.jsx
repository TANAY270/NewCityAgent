import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InfoTooltip = ({ text }) => (
  <div className="tooltip-container">
    ?
    <span className="tooltip-text">{text}</span>
  </div>
);

export default function Onboarding() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(''); // 'login' or 'create'
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobile.length === 10) {
      setStep(2);
    } else {
      alert('Enter 10 digit mobile number');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '1234') { // mock otp
      navigate('/demo');
    } else {
      alert('Invalid OTP. Use 1234');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>
        NewCityAgent Onboarding
        <InfoTooltip text="This page is for users to create an account or login. The bank admin can see how users start their journey." />
      </h1>
      
      {step === 1 && (
        <div>
          <button onClick={() => setMode('login')}>Login</button>
          <button onClick={() => setMode('create')}>Create Account</button>
          
          {mode && (
            <form onSubmit={handleSendOtp} style={{ marginTop: '20px' }}>
              <h2>{mode === 'login' ? 'Login' : 'Create Account'}</h2>
              <label>Mobile Number: </label>
              <input 
                type="text" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
                placeholder="10 digit number"
              />
              <button type="submit">Send OTP</button>
            </form>
          )}
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <h2>Enter OTP (Mock: 1234)</h2>
          <label>OTP: </label>
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
          />
          <button type="submit">Verify & Continue</button>
        </form>
      )}
    </div>
  );
}

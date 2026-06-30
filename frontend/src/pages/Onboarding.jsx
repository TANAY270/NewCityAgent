import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <img src="/logo.png" alt="NewCityAgent Logo" style={{ maxWidth: '200px', marginBottom: '20px' }} />
      <h2>This page is for users to create an account or login. The bank admin can see how users start their journey.</h2>
      
      {step === 1 && (
        <div style={{ marginTop: '40px' }}>
          <button onClick={() => setMode('login')} style={{ marginRight: '10px' }}>Login</button>
          <button onClick={() => setMode('create')}>Create Account</button>
          
          {mode && (
            <form onSubmit={handleSendOtp} style={{ marginTop: '40px' }}>
              <h3>{mode === 'login' ? 'Login' : 'Create Account'}</h3>
              <label>Mobile Number: </label>
              <br/><br/>
              <input 
                type="text" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
                placeholder="10 digit number"
              />
              <br/><br/>
              <button type="submit">Send OTP</button>
            </form>
          )}
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} style={{ marginTop: '40px' }}>
          <h3>Enter OTP (Mock: 1234)</h3>
          <label>OTP: </label>
          <br/><br/>
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
          />
          <br/><br/>
          <button type="submit">Verify & Continue</button>
        </form>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [persona, setPersona] = useState('worker');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('login'); 
  
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      img: '/worker.png',
      title: 'Migrant Workers',
      text: 'Seamless account reactivation and remittance setup for internal migrants.'
    },
    {
      img: '/student.png',
      title: 'Students',
      text: 'Instant digital accounts and pre-qualified education loans for students.'
    }
  ];

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (mobile.length === 10) {
      if (mode === 'create') {
        if (!name) return alert('Name is required');
        try {
          const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone: mobile, persona })
          });
          const data = await res.json();
          if (data.error) {
            alert('Database Error: ' + data.error);
            return;
          }
        } catch (err) {
          console.error('Failed to create user DB entry:', err);
          alert('Network error communicating with backend.');
          return;
        }
      }
      setStep(2);
    } else {
      alert('Enter 10 digit mobile number');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '1234') { 
      navigate('/demo');
    } else {
      alert('Invalid OTP. Use 1234');
    }
  };

  return (
    <div className="moving-gradient" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      
      <div style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', padding: '0', display: 'flex', flexWrap: 'wrap', maxWidth: '900px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        
        {/* Left Column: Hero & Carousel */}
        <div style={{ flex: 1, minWidth: '300px', padding: '40px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '2px solid var(--primary-color)', paddingBottom: '20px', marginBottom: '20px' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '40px' }} />
            <h1 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '24px' }}>NewCityAgent</h1>
          </div>
          <h2 style={{ fontWeight: 'normal', color: 'var(--text-color)', fontSize: '16px', lineHeight: '1.6' }}>
            An agentic banking solution designed to detect city-change patterns among internal migrants and proactively assist with account setup and remittance.
          </h2>

          <div style={{ marginTop: 'auto', border: '1px solid var(--border-color)', padding: '20px', textAlign: 'center' }}>
            <img src={slides[slide].img} alt={slides[slide].title} style={{ height: '120px', objectFit: 'contain' }} />
            <h3 style={{ color: 'var(--primary-color)', margin: '15px 0 5px 0' }}>{slides[slide].title}</h3>
            <p style={{ fontSize: '14px', margin: 0 }}>{slides[slide].text}</p>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setSlide(0)} style={{ opacity: slide === 0 ? 1 : 0.5, padding: '5px 15px' }}>1</button>
              <button onClick={() => setSlide(1)} style={{ opacity: slide === 1 ? 1 : 0.5, padding: '5px 15px' }}>2</button>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div style={{ flex: 1, minWidth: '300px', padding: '40px', backgroundColor: 'var(--card-bg)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <button onClick={() => setMode('login')} style={{ flex: 1, backgroundColor: mode==='login'?'var(--primary-color)':'transparent', color: mode==='login'?'white':'var(--text-color)', border: '1px solid var(--primary-color)' }}>Login</button>
                <button onClick={() => setMode('create')} style={{ flex: 1, backgroundColor: mode==='create'?'var(--primary-color)':'transparent', color: mode==='create'?'white':'var(--text-color)', border: '1px solid var(--primary-color)' }}>Register</button>
              </div>
              
              <form onSubmit={handleSendOtp}>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px', fontSize: '20px', textTransform: 'uppercase' }}>
                  {mode === 'login' ? 'Login to NewCityAgent' : 'Register for Access'}
                </h3>
                
                {mode === 'create' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Full Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" />
                  </div>
                )}
                
                {mode === 'create' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Persona *</label>
                    <select value={persona} onChange={e => setPersona(e.target.value)}>
                      <option value="worker">Migrant Worker</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Mobile Number *</label>
                  <input type="text" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter 10 digit number" />
                </div>
                
                <button type="submit" style={{ width: '100%' }}>Send OTP</button>
              </form>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '10px', fontSize: '20px', textTransform: 'uppercase' }}>OTP Verification</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-color)', marginBottom: '20px' }}>Use mock OTP: 1234</p>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Enter OTP *</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 4 digit OTP" />
              </div>
              <button type="submit" style={{ width: '100%' }}>Verify & Proceed</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

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
      text: 'Lower CAC by seamlessly reactivating dormant accounts and issuing localized virtual cards when internal migrants relocate.'
    },
    {
      img: '/student.png',
      title: 'Students',
      text: 'Acquire the next generation of customers by identifying student relocations and offering pre-qualified conversational onboarding.'
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
    <div className="moving-gradient" style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      
      <div className="card" style={{ padding: '0', display: 'flex', flexWrap: 'wrap', maxWidth: '1000px', width: '100%', overflow: 'hidden', border: 'none' }}>
        
        {/* Left Column: Hero & Carousel */}
        <div style={{ flex: 1, minWidth: '350px', padding: '50px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, color: 'var(--text-color)', fontSize: '28px', fontWeight: '800' }}>NewCity<span style={{ color: 'var(--primary-color)' }}>Agent</span></h1>
          </div>
          <h2 style={{ fontWeight: 'normal', color: 'var(--text-color)', fontSize: '18px', lineHeight: '1.6', opacity: 0.8 }}>
            Agentic AI that lowers CAC by detecting life-events (like city changes) to intelligently reactivate dormant accounts through hyper-personalised engagement.
          </h2>

          <div style={{ marginTop: 'auto', textAlign: 'center', padding: '30px 0' }}>
            <img src={slides[slide].img} alt={slides[slide].title} style={{ height: '180px', objectFit: 'contain', marginBottom: '20px' }} />
            <h3 style={{ color: 'var(--primary-color)', margin: '0 0 10px 0', fontSize: '22px' }}>{slides[slide].title}</h3>
            <p style={{ fontSize: '15px', margin: 0, opacity: 0.8 }}>{slides[slide].text}</p>
            
            {/* Carousel Dots */}
            <div style={{ marginTop: '25px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <div onClick={() => setSlide(0)} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: slide === 0 ? 'var(--primary-color)' : 'var(--border-color)', cursor: 'pointer', transition: '0.2s' }} />
              <div onClick={() => setSlide(1)} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: slide === 1 ? 'var(--primary-color)' : 'var(--border-color)', cursor: 'pointer', transition: '0.2s' }} />
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div style={{ flex: 1, minWidth: '350px', padding: '50px', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid var(--border-color)' }}>
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                <button onClick={() => setMode('login')} style={{ flex: 1, background: mode==='login'?'var(--nav-bg)':'transparent', color: mode==='login'?'white':'var(--text-color)', border: mode==='login'?'none':'1px solid var(--border-color)' }}>Login</button>
                <button onClick={() => setMode('create')} style={{ flex: 1, background: mode==='create'?'var(--nav-bg)':'transparent', color: mode==='create'?'white':'var(--text-color)', border: mode==='create'?'none':'1px solid var(--border-color)' }}>Register</button>
              </div>
              
              <form onSubmit={handleSendOtp}>
                <h3 style={{ marginBottom: '25px', fontSize: '24px' }}>
                  {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
                </h3>
                
                {mode === 'create' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Full Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" />
                  </div>
                )}
                
                {mode === 'create' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Persona *</label>
                    <select value={persona} onChange={e => setPersona(e.target.value)}>
                      <option value="worker">Migrant Worker</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Mobile Number *</label>
                  <input type="text" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter 10 digit number" />
                </div>
                
                <button type="submit" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>Send OTP</button>
              </form>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <h3 style={{ marginBottom: '15px', fontSize: '24px' }}>OTP Verification</h3>
              <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '30px' }}>Please enter the OTP sent to {mobile}. <br/><strong style={{color:'var(--primary-color)'}}>(Mock: 1234)</strong></p>
              
              <div style={{ marginBottom: '30px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Enter OTP *</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="XXXX" style={{ fontSize: '20px', letterSpacing: '4px', textAlign: 'center' }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>Verify & Proceed</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

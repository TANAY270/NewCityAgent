import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [persona, setPersona] = useState('worker');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(''); // 'login' or 'create'
  
  // Carousel state
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      img: '/worker.png',
      title: 'Migrant Workers',
      text: 'Over 30 million internal migrants change cities annually. We help you setup remittance instantly without the friction of local onboarding.'
    },
    {
      img: '/student.png',
      title: 'Students',
      text: 'Moving for higher education? We help you open student accounts and pre-qualify for education loans instantly.'
    }
  ];

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (mobile.length === 10) {
      if (mode === 'create') {
        if (!name) return alert('Name is required');
        try {
          await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone: mobile, persona })
          });
        } catch (err) {
          console.error('Failed to create user DB entry:', err);
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
    <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
      
      {/* Left Column: Hero & Carousel */}
      <div style={{ flex: 1, minWidth: '300px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '60px' }} />
          <h1 style={{ margin: 0 }}>NewCityAgent</h1>
        </div>
        <h2 style={{ fontWeight: 'normal', color: '#555', marginTop: '10px' }}>
          An agentic banking solution designed to detect city-change patterns among internal migrants and proactively assist with account setup and remittance.
        </h2>

        {/* Carousel */}
        <div style={{ marginTop: '40px', border: '1px solid black', padding: '20px', textAlign: 'center' }}>
          <img src={slides[slide].img} alt={slides[slide].title} style={{ height: '200px', objectFit: 'contain' }} />
          <h3>{slides[slide].title}</h3>
          <p>{slides[slide].text}</p>
          <div style={{ marginTop: '15px' }}>
            <button onClick={() => setSlide(0)} style={{ fontWeight: slide === 0 ? 'bold' : 'normal' }}>1</button>
            <button onClick={() => setSlide(1)} style={{ fontWeight: slide === 1 ? 'bold' : 'normal' }}>2</button>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <button onClick={() => setMode('login')} style={{ marginRight: '10px', fontWeight: mode==='login'?'bold':'normal' }}>Login</button>
              <button onClick={() => setMode('create')} style={{ fontWeight: mode==='create'?'bold':'normal' }}>Create Account</button>
            </div>
            
            {mode && (
              <form onSubmit={handleSendOtp} style={{ border: '1px solid black', padding: '30px', width: '300px' }}>
                <h3 style={{ marginTop: 0 }}>{mode === 'login' ? 'Login' : 'Create Account'}</h3>
                
                {mode === 'create' && (
                  <div style={{ marginBottom: '15px' }}>
                    <label>Full Name</label><br/>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '5px' }} />
                  </div>
                )}
                
                {mode === 'create' && (
                  <div style={{ marginBottom: '15px' }}>
                    <label>Persona</label><br/>
                    <select value={persona} onChange={e => setPersona(e.target.value)} style={{ width: '100%', padding: '5px' }}>
                      <option value="worker">Migrant Worker</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                )}

                <div style={{ marginBottom: '15px' }}>
                  <label>Mobile Number</label><br/>
                  <input type="text" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="10 digit number" style={{ width: '100%', padding: '5px' }} />
                </div>
                
                <button type="submit" style={{ width: '100%', padding: '10px' }}>Send OTP</button>
              </form>
            )}
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ border: '1px solid black', padding: '30px', width: '300px' }}>
            <h3 style={{ marginTop: 0 }}>Enter OTP</h3>
            <p style={{ fontSize: '12px', color: '#666' }}>Mock: 1234</p>
            <div style={{ marginBottom: '15px' }}>
              <label>OTP</label><br/>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} style={{ width: '100%', padding: '5px' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px' }}>Verify & Continue</button>
          </form>
        )}
      </div>
    </div>
  );
}

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

export default function MobileDemo() {
  const [time, setTime] = useState(new Date());
  const [step, setStep] = useState(0); 
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [persona, setPersona] = useState('worker'); 
  
  // New State for Step 6 Form
  const [remitAmount, setRemitAmount] = useState('');
  const [remitFreq, setRemitFreq] = useState('monthly');
  const [remitName, setRemitName] = useState('');
  
  const targetPhone = "9876543210";
  const targetId = persona === 'worker' ? "1234 5678 9012" : "STU-998877";

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === 2) {
      let pIndex = 0; let aIndex = 0;
      const typeInterval = setInterval(() => {
        if (pIndex < targetPhone.length) {
          setPhone(targetPhone.slice(0, pIndex + 1)); pIndex++;
        } else if (aIndex < targetId.length) {
          setIdNumber(targetId.slice(0, aIndex + 1)); aIndex++;
        } else {
          clearInterval(typeInterval); setStep(3);
        }
      }, 100);
      return () => clearInterval(typeInterval);
    }
  }, [step, targetId]);

  const resetFlow = (newPersona) => {
    setPersona(newPersona);
    setStep(0); setPhone(''); setIdNumber('');
  };

  const notificationText = persona === 'worker' 
    ? "Welcome to Mumbai! City change detected. Tap to setup your local banking."
    : "Welcome to Delhi! University session starting soon. Tap to set up your student banking.";

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Customer Simulator</h1>
          <HelpPopup 
            title="Simulator Logic" 
            content="This module simulates the end-to-end customer journey on a mobile device. Trigger a scenario, and watch how the agent detects location changes and guides the user through Reactivation or Account Opening." 
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ backgroundColor: persona === 'worker' ? 'var(--primary-color)' : 'transparent', color: persona === 'worker' ? 'white' : 'var(--text-color)', border: '1px solid var(--primary-color)' }} onClick={() => resetFlow('worker')}>Migrant Worker Demo</button>
          <button style={{ backgroundColor: persona === 'student' ? 'var(--primary-color)' : 'transparent', color: persona === 'student' ? 'white' : 'var(--text-color)', border: '1px solid var(--primary-color)' }} onClick={() => resetFlow('student')}>Student Demo</button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{
          width: '375px', height: '750px', border: '15px solid var(--phone-bezel)', borderRadius: '35px', position: 'relative',
          display: 'flex', flexDirection: 'column', backgroundColor: 'white', overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
          <div style={{ padding: '8px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', backgroundColor: 'black', color: 'white', zIndex: 10, fontWeight: 'bold' }}>
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span>100% 🔋</span>
          </div>
          
          <div style={{ backgroundColor: 'var(--secondary-color)', padding: '15px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
            NewCityAgent
          </div>

          <div style={{ flexGrow: 1, position: 'relative', backgroundColor: '#f9fafb' }}>
            
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #ccc', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                <p>Waiting for agent signals...</p>
                <p style={{ fontSize: '12px' }}>Trigger a scenario above.</p>
              </div>
            )}

            {step === 1 && (
              <div onClick={() => setStep(2)} style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', padding: '15px', backgroundColor: 'white', cursor: 'pointer', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderLeft: '4px solid var(--primary-color)' }}>
                <strong style={{ color: 'var(--primary-color)' }}>NewCityAgent Alert</strong>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#333' }}>{notificationText}</p>
              </div>
            )}

            {step >= 2 && step <= 5 && (
              <div style={{ padding: '25px', color: '#111827' }}>
                <h2 style={{ textAlign: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '15px' }}>Yono Lite</h2>
                
                {step < 5 && (
                  <div style={{ marginTop: '25px' }}>
                    <h3 style={{ fontSize: '18px' }}>{persona === 'worker' ? 'Reactivate Account' : 'Setup Student Account'}</h3>
                    <div style={{ margin: '20px 0' }}>
                      <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Phone Number</label>
                      <input type="text" value={phone} readOnly style={{ backgroundColor: '#f3f4f6' }} />
                    </div>
                    <div style={{ margin: '20px 0' }}>
                      <label style={{ fontSize: '14px', fontWeight: 'bold' }}>{persona === 'worker' ? 'Aadhaar Number' : 'University ID'}</label>
                      <input type="text" value={idNumber} readOnly style={{ backgroundColor: '#f3f4f6' }} />
                    </div>
                    <button onClick={() => { if(step===3) setStep(4); }} disabled={step<3} style={{ width: '100%', padding: '12px', opacity: step<3 ? 0.5 : 1 }}>Submit</button>
                  </div>
                )}

                {step === 4 && (
                  <div style={{ marginTop: '25px', borderTop: '2px solid var(--border-color)', paddingTop: '25px' }}>
                    <div style={{ border: '1px solid var(--border-color)', padding: '15px', marginBottom: '20px', backgroundColor: '#eef2ff', borderRadius: '8px' }}>
                      <strong style={{ color: '#4f46e5' }}>SMS Notification</strong>
                      <p style={{ margin: '8px 0 0 0', color: '#333' }}>Your OTP is 5678</p>
                    </div>
                    <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Enter OTP</label>
                    <input type="text" defaultValue="5678" />
                    <button onClick={() => setStep(5)} style={{ width: '100%', padding: '12px', marginTop: '15px' }}>Verify</button>
                  </div>
                )}

                {step === 5 && (
                  <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <h2 style={{ color: '#10b981' }}>{persona === 'worker' ? 'Account Active' : 'Student Account Active'}</h2>
                    <div style={{ marginTop: '40px', border: '1px solid var(--border-color)', padding: '20px', textAlign: 'left', borderRadius: '8px', backgroundColor: 'white' }}>
                      <h3 style={{ color: 'var(--primary-color)', margin: '0 0 10px 0' }}>{persona === 'worker' ? 'Automated Remittance' : 'Education Loan Offer'}</h3>
                      <p style={{ fontSize: '14px', color: '#4b5563' }}>{persona === 'worker' ? 'Schedule a recurring transfer to your family in Patna.' : 'Pre-qualified for ₹5 Lakh Loan.'}</p>
                      <button onClick={() => setStep(6)} style={{ width: '100%', padding: '12px', marginTop: '15px' }}>
                        {persona === 'worker' ? 'Schedule Transfer' : 'Claim Offer'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 6 && (
              <div style={{ padding: '25px', color: '#111827' }}>
                <h2 style={{ textAlign: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '15px' }}>
                  {persona === 'worker' ? 'Remittance Setup' : 'Loan Application'}
                </h2>
                
                {persona === 'worker' ? (
                  <div style={{ marginTop: '25px' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Recipient Name</label>
                      <input type="text" value={remitName} onChange={e=>setRemitName(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Amount (₹)</label>
                      <input type="number" value={remitAmount} onChange={e=>setRemitAmount(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Frequency</label>
                      <select value={remitFreq} onChange={e=>setRemitFreq(e.target.value)}>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <button onClick={() => setStep(7)} style={{ width: '100%', padding: '12px', marginTop: '20px' }}>Confirm Transfer</button>
                  </div>
                ) : (
                  <div style={{ marginTop: '25px' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Loan Amount (₹)</label>
                      <input type="number" defaultValue="500000" />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Tenure</label>
                      <select><option>5 Years</option><option>10 Years</option></select>
                    </div>
                    <button onClick={() => setStep(7)} style={{ width: '100%', padding: '12px', marginTop: '20px' }}>Accept Terms & Apply</button>
                  </div>
                )}
              </div>
            )}

            {step === 7 && (
              <div style={{ padding: '50px 25px', textAlign: 'center', color: '#111827' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 20px auto' }}>✓</div>
                <h2>Success!</h2>
                <p style={{ color: '#4b5563' }}>Your request has been processed successfully.</p>
                <button onClick={() => resetFlow(persona)} style={{ padding: '12px 24px', marginTop: '30px', backgroundColor: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>Done</button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

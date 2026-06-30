import React, { useState, useEffect } from 'react';

const InfoTooltip = ({ text }) => (
  <div className="tooltip-container">
    ?
    <span className="tooltip-text">{text}</span>
  </div>
);

export default function MobileDemo() {
  const [time, setTime] = useState(new Date());
  const [step, setStep] = useState(0); 
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [persona, setPersona] = useState('worker'); // 'worker' or 'student'

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
      let pIndex = 0;
      let aIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (pIndex < targetPhone.length) {
          setPhone(targetPhone.slice(0, pIndex + 1));
          pIndex++;
        } else if (aIndex < targetId.length) {
          setIdNumber(targetId.slice(0, aIndex + 1));
          aIndex++;
        } else {
          clearInterval(typeInterval);
          setStep(3);
        }
      }, 100);
      
      return () => clearInterval(typeInterval);
    }
  }, [step, targetId]);

  const resetFlow = (newPersona) => {
    setPersona(newPersona);
    setStep(0);
    setPhone('');
    setIdNumber('');
  };

  const notificationText = persona === 'worker' 
    ? "Welcome to Mumbai! City change detected. Tap to setup your local banking."
    : "Welcome to Delhi! University session starting soon. Tap to set up your student banking.";

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <h1>
          Guided Demo Flow
          <InfoTooltip text="This simulates a user's mobile phone experience. You can switch personas here." />
        </h1>
        <div style={{ marginTop: '10px' }}>
          <button 
            style={{ fontWeight: persona === 'worker' ? 'bold' : 'normal', backgroundColor: persona === 'worker' ? '#e0e0e0' : 'white' }}
            onClick={() => resetFlow('worker')}
          >
            Run Migrant Worker Demo
          </button>
          <button 
            style={{ fontWeight: persona === 'student' ? 'bold' : 'normal', backgroundColor: persona === 'student' ? '#e0e0e0' : 'white' }}
            onClick={() => resetFlow('student')}
          >
            Run Student Demo
          </button>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{
          width: '375px',
          height: '667px',
          border: '2px solid black',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          overflow: 'hidden'
        }}>
          <div style={{ 
            borderBottom: '1px solid black', 
            padding: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            backgroundColor: 'white',
            zIndex: 10
          }}>
            <span>{time.toLocaleTimeString()}</span>
            <span>{time.toLocaleDateString()} | 100% 🔋</span>
          </div>

          <div style={{ flexGrow: 1, position: 'relative' }}>
            
            {step < 2 && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Home Screen (Empty)</p>
              </div>
            )}

            {step === 1 && (
              <div 
                onClick={() => setStep(2)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  right: '10px',
                  border: '1px solid black',
                  padding: '10px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
              >
                <strong>NewCityAgent Alert</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{notificationText}</p>
              </div>
            )}

            {step >= 2 && (
              <div style={{ padding: '20px' }}>
                <h2 style={{ textAlign: 'center', borderBottom: '1px solid black', paddingBottom: '10px' }}>Yono Lite</h2>
                
                {step < 5 && (
                  <div style={{ marginTop: '20px' }}>
                    <h3>{persona === 'worker' ? 'Reactivate Account' : 'Setup Student Account'}</h3>
                    
                    <div style={{ margin: '20px 0' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Phone Number</label>
                      <input type="text" value={phone} readOnly style={{ width: '100%', padding: '5px' }} />
                    </div>
                    
                    <div style={{ margin: '20px 0' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>
                        {persona === 'worker' ? 'Aadhaar Number' : 'University ID'}
                      </label>
                      <input type="text" value={idNumber} readOnly style={{ width: '100%', padding: '5px' }} />
                    </div>

                    <button 
                      onClick={() => { if(step === 3) setStep(4); }}
                      disabled={step < 3}
                      style={{ width: '100%', padding: '10px', opacity: step < 3 ? 0.5 : 1 }}
                    >
                      Submit
                    </button>
                  </div>
                )}

                {step === 4 && (
                  <div style={{ marginTop: '20px', borderTop: '1px solid black', paddingTop: '20px' }}>
                    <div style={{
                      border: '1px solid black',
                      padding: '10px',
                      marginBottom: '20px',
                      backgroundColor: '#f9f9f9'
                    }}>
                      <strong>SMS Notification</strong>
                      <p style={{ margin: '5px 0 0 0' }}>Your OTP is 5678</p>
                    </div>

                    <label style={{ display: 'block', marginBottom: '5px' }}>Enter OTP</label>
                    <input type="text" defaultValue="5678" style={{ width: '100%', padding: '5px' }} />
                    <button onClick={() => setStep(5)} style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
                      Verify
                    </button>
                  </div>
                )}

                {step === 5 && persona === 'worker' && (
                  <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <h2>Account Active</h2>
                    <p>Your local banking features are now enabled.</p>
                    
                    <div style={{ marginTop: '40px', border: '1px solid black', padding: '15px', textAlign: 'left' }}>
                      <h3>Set Up Automated Remittance</h3>
                      <p>Schedule a recurring monthly transfer to support your family back in Patna.</p>
                      <button style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
                        Schedule Transfer
                      </button>
                    </div>
                  </div>
                )}

                {step === 5 && persona === 'student' && (
                  <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <h2>Student Account Active</h2>
                    <p>Your student banking features are now enabled.</p>
                    
                    <div style={{ marginTop: '40px', border: '1px solid black', padding: '15px', textAlign: 'left' }}>
                      <h3>Education Loan Offer</h3>
                      <p>Pre-qualified for ₹5 Lakh Education Loan for Delhi University.</p>
                      <button style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
                        Claim Offer
                      </button>
                    </div>
                  </div>
                )}
                
              </div>
            )}
          </div>
        </div>
        
        {step === 4 && (
          <div style={{ 
            marginLeft: '40px', 
            marginTop: '150px',
            padding: '20px', 
            border: '2px dashed black',
            backgroundColor: 'white',
            height: 'fit-content'
          }}>
            <h3>[EXTERNAL VIEW]</h3>
            <h2>OTP Received</h2>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>5678</p>
            <p style={{ maxWidth: '200px' }}>This is floating outside to show the audience the OTP received on the phone.</p>
          </div>
        )}
      </div>
    </div>
  );
}

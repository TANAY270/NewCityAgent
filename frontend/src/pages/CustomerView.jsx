import React, { useState, useEffect } from 'react';
import { getState, reactivateAccount, setupRemittance, openAccount } from '../services/api';
import { Smartphone, CheckCircle, ShieldAlert } from 'lucide-react';



export default function CustomerView() {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [otp, setOtp] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [remittanceData, setRemittanceData] = useState({
    beneficiaryName: '',
    beneficiaryAccount: '',
    amount: ''
  });

  const fetchState = async () => {
    try {
      const data = await getState();
      if (data && data.users && data.users.length > 0) {
        const latestNotif = data.notifications && data.notifications.length > 0
          ? data.notifications[data.notifications.length - 1]
          : null;

        let targetUser = null;
        if (latestNotif) {
          targetUser = data.users.find(u => u.id === latestNotif.userId) || null;
          setNotification(latestNotif);
        }
        setUser(targetUser);
      }
    } catch (e) {
      // silently ignore polling errors
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchState, 3000);
    fetchState();
    return () => clearInterval(interval);
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  const handleReactivate = async () => {
    if (!user) return;
    try {
      const res = await reactivateAccount(user.phone, otp);
      if (res && res.error) {
        showError(res.error);
        return;
      }
      showSuccess('Account Successfully Reactivated!');
      setOtp('');
      fetchState();
    } catch (e) {
      showError('Error reactivating account. Please try again.');
    }
  };

  const handleOpenAccountFromSimulator = async () => {
    if (!user) return;
    if (!otp.trim()) {
      showError('Please enter the Aadhaar OTP to proceed.');
      return;
    }
    if (otp.trim() !== '123456') {
      showError('Incorrect OTP. Use 123456 for this demo.');
      return;
    }
    try {
      const res = await openAccount({
        phone: user.phone,
        name: user.name,
        aadhaar: '234567890123',
        preferredLanguage: user.preferredLanguage || 'English',
        initialDeposit: 1000,
        currentCity: user.currentCity || 'Pune',
        segment: user.segment
      });
      if (res && res.error) {
        showError(res.error);
        return;
      }
      showSuccess('Insta Savings Account Opened Successfully!');
      setOtp('');
      fetchState();
    } catch (e) {
      showError('Error opening account. Please try again.');
    }
  };

  const handleRemittance = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await setupRemittance({ phone: user.phone, ...remittanceData });
      if (res && res.error) {
        showError(res.error);
        return;
      }
      showSuccess('Remittance Schedule Created Successfully!');
      setRemittanceData({ beneficiaryName: '', beneficiaryAccount: '', amount: '' });
      fetchState();
    } catch (e) {
      showError('Error creating remittance. Please try again.');
    }
  };

  // accountStatus is the correct field name from the backend
  const accountStatus = user?.accountStatus || user?.status || 'unknown';

  return (
    <div style={{ padding: '40px 80px', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>



      {/* Simulated Android Device — centered below the info panel */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      {successMsg && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#22c55e', color: 'white', padding: '12px 20px', borderRadius: '8px', zIndex: 9999, fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#ef4444', color: 'white', padding: '12px 20px', borderRadius: '8px', zIndex: 9999, fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          {errorMsg}
        </div>
      )}

      {/* Simulated Android Device */}
      <div style={{
        width: '360px',
        height: '740px',
        border: '14px solid #1a1a1a',
        borderRadius: '24px',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Android Status Bar */}
        <div style={{
          background: 'var(--bg-topbar)',
          color: 'white',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          borderBottom: '1px solid #333'
        }}>
          <span>10:00 AM</span>
          <div style={{ display: 'flex', gap: '5px' }}>
            <Smartphone size={14} />
          </div>
        </div>

        {/* App Header */}
        <div style={{ background: 'var(--primary-purple)', color: 'white', padding: '15px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'white' }}>NewCityAgent</h2>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {!user ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>
              <div style={{ margin: '0 auto 20px', width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--text-secondary)', borderTopColor: 'var(--primary-purple)', animation: 'spin 1s linear infinite' }} />
              <p>Waiting for agent signals...</p>
              <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>Trigger a scenario in the Admin Dashboard.</p>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: '5px', color: 'var(--text-primary)' }}>Hi, {user.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status:
                <span style={{
                  color: accountStatus === 'dormant' ? '#e74c3c' : accountStatus === 'active' ? '#2ecc71' : '#888',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {accountStatus.toUpperCase()}
                </span>
              </p>

              {/* AI Notification Card */}
              {notification && (
                <div style={{
                  background: 'var(--gradient-banner)',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  <strong style={{ color: 'white' }}>Agent Alert</strong>
                  <p style={{ marginTop: '5px', color: 'white' }}>{notification.message}</p>
                </div>
              )}

              {/* Dormant Reactivation Flow */}
              {accountStatus === 'dormant' && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)'
                }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', color: '#e74c3c' }}>
                    <ShieldAlert size={20} />
                    <strong>Aadhaar Reactivation Required</strong>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Aadhaar OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--card-border)',
                      borderRadius: '4px',
                      marginBottom: '10px',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    onClick={handleReactivate}
                    style={{
                      width: '100%',
                      background: 'var(--primary-purple)',
                      color: 'white',
                      padding: '10px',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}
                  >
                    Verify & Reactivate
                  </button>
                </div>
              )}

              {/* New Account Opening Flow */}
              {accountStatus === 'none' && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)'
                }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', color: 'var(--primary-purple)' }}>
                    <ShieldAlert size={20} />
                    <strong>Aadhaar e-KYC Verification</strong>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    Verify Aadhaar OTP to open your new digital Insta Savings Account.
                  </p>
                  <input
                    type="text"
                    placeholder="Enter Aadhaar OTP (use 123456)"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--card-border)',
                      borderRadius: '4px',
                      marginBottom: '10px',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    onClick={handleOpenAccountFromSimulator}
                    style={{
                      width: '100%',
                      background: 'var(--primary-purple)',
                      color: 'white',
                      padding: '10px',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}
                  >
                    Verify & Open Account
                  </button>
                </div>
              )}

              {/* Active Account Dashboard & Services */}
              {accountStatus === 'active' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                  {/* Premium Balance Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, #3e1b70 0%, #b0185e 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(62, 27, 112, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* SVG overlay to make it look like a credit card chip/design */}
                    <div style={{ opacity: 0.1, position: 'absolute', right: '-20px', bottom: '-20px' }}>
                      <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="10" />
                      </svg>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '1px', color: 'white' }}>
                        SBI Digital Savings
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        {user.segment === 'worker' ? 'Active (Reactivated)' : 'Active (New)'}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>
                      ₹{parseFloat(user.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h4>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7, color: 'white' }}>Available Balance</span>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>{user.name}</span>
                        <span style={{ fontSize: '0.65rem', opacity: 0.7, color: 'white' }}>
                          A/C: SBI-XXXX-{user.phone.slice(-4)}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold', fontStyle: 'italic', color: 'white' }}>yono</span>
                    </div>
                  </div>

                  {/* Incentives / Dormant Account Benefits Section */}
                  <div style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    border: '1px solid var(--card-border)',
                    padding: '12px 14px'
                  }}>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                      🎁 Special Account Benefits & Incentives
                    </strong>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>🛡️ Accidental Insurance Cover</span>
                        <strong style={{ color: '#10b981' }}>₹1,00,000 Free</strong>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>📊 Balance Requirement</span>
                        <strong style={{ color: '#10b981' }}>Waived (₹0 Min)</strong>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>⚡ Remittance Transfer Fee</span>
                        <strong style={{ color: '#10b981' }}>Zero Fee</strong>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>💰 Welcome Reward Offer</span>
                        <strong style={{ color: 'var(--secondary-magenta)' }}>₹50 Cashback</strong>
                      </li>
                    </ul>
                  </div>

                  {/* Worker Services (Remittance Form) */}
                  {user.segment === 'worker' && (
                    <div style={{
                      background: 'var(--bg-secondary)',
                      padding: '15px',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px', color: 'var(--secondary-magenta)' }}>
                        <CheckCircle size={16} />
                        <strong style={{ fontSize: '0.9rem' }}>Send Money Home</strong>
                      </div>
                      <form onSubmit={handleRemittance} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="text" placeholder="Beneficiary Name" required
                          value={remittanceData.beneficiaryName}
                          onChange={e => setRemittanceData({ ...remittanceData, beneficiaryName: e.target.value })}
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        />
                        <input
                          type="text" placeholder="Account Number" required
                          value={remittanceData.beneficiaryAccount}
                          onChange={e => setRemittanceData({ ...remittanceData, beneficiaryAccount: e.target.value })}
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        />
                        <input
                          type="number" placeholder="Amount (₹)" required
                          value={remittanceData.amount}
                          onChange={e => setRemittanceData({ ...remittanceData, amount: e.target.value })}
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                        />
                        <button
                          type="submit"
                          style={{
                            width: '100%',
                            background: 'var(--secondary-magenta)',
                            color: 'white',
                            padding: '10px',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            marginTop: '4px'
                          }}
                        >
                          Setup Transfer
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Student Services (Loan limits, Voucher) */}
                  {user.segment === 'student' && (
                    <div style={{
                      background: 'var(--bg-secondary)',
                      padding: '15px',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--primary-purple)' }}>
                        <CheckCircle size={16} />
                        <strong style={{ fontSize: '0.9rem' }}>Student Benefits Hub</strong>
                      </div>
                      
                      <div style={{
                        background: 'var(--bg-primary)',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid var(--card-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Pre-Approved Education Loan</span>
                        <strong style={{ fontSize: '1rem', color: 'var(--primary-purple)' }}>₹2,00,000 Limit</strong>
                        <button style={{
                          background: 'var(--primary-purple)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          marginTop: '4px',
                          cursor: 'pointer'
                        }}>
                          Check Pre-Qualification
                        </button>
                      </div>

                      <div style={{
                        background: 'var(--bg-primary)',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid var(--card-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>e-Rupee Books Voucher</span>
                          <strong style={{ fontSize: '0.8rem', color: '#10b981' }}>₹1,500 Available</strong>
                        </div>
                        <button style={{
                          background: 'transparent',
                          border: '1px solid #10b981',
                          color: '#10b981',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}>
                          Redeem
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Android Navigation Bar */}
        <div style={{
          height: '48px',
          background: '#000',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderTop: '1px solid #222'
        }}>
          <div style={{ width: '0', height: '0', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '12px solid #888' }} />
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #888' }} />
          <div style={{ width: '14px', height: '14px', border: '2px solid #888', borderRadius: '2px' }} />
        </div>
      </div>
      </div>


    </div>
  );
}

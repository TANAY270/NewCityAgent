import React, { useState, useEffect, Component } from 'react';
import { triggerScenario, reactivateAccount, resetState, openAccount } from '../services/api';
import { Briefcase, GraduationCap, CheckCircle, ArrowRight, AlertTriangle, RotateCcw } from 'lucide-react';

// Error Boundary to catch render crashes and show a useful message instead of white screen
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('[DemoPage crash]', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-primary)' }}>
          <AlertTriangle size={48} color="#f59e0b" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ color: 'var(--secondary-magenta)', marginBottom: '10px' }}>Something crashed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>{String(this.state.error)}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.85rem' }}>
            This usually means the backend state is stale. Click Reset to clear it, then try again.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); }}
            style={{ background: 'var(--secondary-magenta)', color: 'white', padding: '10px 24px', borderRadius: '4px', fontWeight: 'bold' }}
          >
            Dismiss Error
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function DemoPageInner({ lastSignal }) {
  const [step, setStep] = useState(1);
  const [scenario, setScenario] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lastSignal) {
      const scen = lastSignal.phone === '9876543211' ? 'student' : 'migrant_worker';
      const user = lastSignal.phone === '9876543211' ? 'Priya Sharma' : 'Ramesh Kumar';
      setScenario(scen);
      setResult({
        scenario: scen,
        user,
        phone: lastSignal.phone,
        source: lastSignal.source,
        destinationCity: lastSignal.newCity,
        signalResult: lastSignal
      });
      setStep(2);
    }
  }, [lastSignal]);

  const handleSelectScenario = async (scen) => {
    setError(null);
    setLoading(true);
    setScenario(scen);
    try {
      const res = await triggerScenario(scen);
      console.log('[DemoPage] trigger-scenario response:', JSON.stringify(res));
      if (res && res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setResult(res);
      setStep(2);
    } catch (e) {
      console.error('[DemoPage] trigger-scenario error:', e);
      setError('Network error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!result) return;

    // ── OTP validation ──────────────────────────────────────────────────────
    setOtpError(null);
    if (!otp.trim()) {
      setOtpError('Please enter the Aadhaar OTP to proceed.');
      return;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      setOtpError('OTP must be exactly 6 digits.');
      return;
    }
    if (otp.trim() !== '123456') {
      setOtpError('Incorrect OTP. Use 123456 for this demo.');
      return;
    }
    // ────────────────────────────────────────────────────────────────────────

    setError(null);
    setLoading(true);
    try {
      const phone = result.phone || '9876543210';
      const res = await reactivateAccount(phone, otp.trim());
      console.log('[DemoPage] reactivate response:', JSON.stringify(res));
      if (res && res.error) {
        setError(res.error);
        return;
      }
      setStep(4);
    } catch (e) {
      console.error('[DemoPage] reactivate error:', e);
      setError('Reactivation error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError(null);
    setOtpError(null);
    try {
      await resetState();
    } catch (e) {
      console.error('[DemoPage] reset error:', e);
    }
    setStep(1);
    setScenario(null);
    setResult(null);
    setOtp('');
  };

  const handleOpenAccount = async () => {
    if (!result) return;

    // ── OTP validation ──────────────────────────────────────────────────────
    setOtpError(null);
    if (!otp.trim()) {
      setOtpError('Please enter the Aadhaar OTP to proceed.');
      return;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      setOtpError('OTP must be exactly 6 digits.');
      return;
    }
    if (otp.trim() !== '123456') {
      setOtpError('Incorrect OTP. Use 123456 for this demo.');
      return;
    }
    // ────────────────────────────────────────────────────────────────────────

    setError(null);
    setLoading(true);
    try {
      const phone = result.phone || '9876543211';
      const name = result.user || 'Priya Sharma';
      const res = await openAccount({
        phone,
        name,
        aadhaar: '234567890123',
        preferredLanguage: 'English',
        initialDeposit: 1000,
        currentCity: newCity,
        segment: 'student'
      });
      console.log('[DemoPage] openAccount response:', JSON.stringify(res));
      if (res && res.error) {
        setError(res.error);
        return;
      }
      setStep(4);
    } catch (e) {
      console.error('[DemoPage] openAccount error:', e);
      setError('Account opening error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const signalResult = result?.signalResult || {};
  const cityChanged = signalResult.cityChangeDetected === true;
  const prevCity = signalResult.previousCity || '—';
  const newCity = signalResult.newCity || result?.destinationCity || '—';
  const notifMessage = signalResult.notification?.message || '';

  return (
    <div style={{ padding: '48px 80px', minHeight: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>

      {/* Error Banner */}
      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: '8px', padding: '15px 20px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#b91c1c' }}>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'transparent', color: '#b91c1c', fontSize: '1.2rem', fontWeight: 'bold' }}>×</button>
        </div>
      )}

      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '56px', position: 'relative', maxWidth: '500px', width: '100%', alignSelf: 'center' }}>
        <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: 'var(--card-border)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '15px', left: '0', width: `${((step - 1) / 3) * 100}%`, height: '2px', background: 'var(--primary-purple)', zIndex: 0, transition: 'width 0.4s ease' }} />
        {[1, 2, 3, 4].map(num => (
          <div key={num} style={{ flex: 1, display: 'flex', justifyContent: num === 1 ? 'flex-start' : num === 4 ? 'flex-end' : 'center', zIndex: 1 }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: step >= num ? 'var(--primary-purple)' : 'var(--bg-secondary)',
              color: step >= num ? 'white' : 'var(--text-secondary)',
              border: step >= num ? '2px solid var(--primary-purple)' : '2px solid var(--card-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold',
              boxShadow: step === num ? '0 0 0 5px rgba(62,27,112,0.25)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {num}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Choose Scenario */}
      {step === 1 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '12px', color: 'var(--primary-purple)', fontSize: '1.75rem' }}>Select a Demo Scenario</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '48px' }}>
            Make sure you click <strong>Reset State</strong> on the Dashboard before running a fresh demo.
          </p>
          <div style={{ display: 'flex', gap: '32px', flex: 1 }}>

            {/* Migrant Worker Card */}
            <div
              style={{
                flex: 1, padding: '48px 36px', borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: scenario === 'migrant_worker' ? '2px solid var(--primary-purple)' : '2px solid transparent',
                background: 'var(--bg-secondary)', boxShadow: 'var(--card-shadow)',
                textAlign: 'center', opacity: (loading && scenario !== 'migrant_worker') ? 0.5 : 1,
                transition: 'border 0.2s, box-shadow 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}
              onClick={() => !loading && handleSelectScenario('migrant_worker')}
            >
              <Briefcase size={56} color="var(--primary-purple)" style={{ display: 'block', margin: '0 auto 20px' }} />
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>Migrant Worker</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '0.95rem' }}>Ramesh Kumar · Dormant Account</p>
              <div style={{ marginTop: '20px', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', color: 'var(--text-primary)' }}>
                <span>Patna</span> <ArrowRight size={14} /> <span>Bengaluru</span>
              </div>
              <div style={{ marginTop: '20px', padding: '6px 14px', background: '#3e1b7018', color: 'var(--primary-purple)', borderRadius: '6px', display: 'inline-block', fontSize: '0.85rem', fontWeight: 'bold' }}>
                ATM Geolocation Signal
              </div>
              {loading && scenario === 'migrant_worker' && (
                <p style={{ marginTop: '20px', color: 'var(--highlight-cyan)' }}>Running LLM Agent...</p>
              )}
            </div>

            {/* Student Card */}
            <div
              style={{
                flex: 1, padding: '48px 36px', borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: scenario === 'student' ? '2px solid var(--secondary-magenta)' : '2px solid transparent',
                background: 'var(--bg-secondary)', boxShadow: 'var(--card-shadow)',
                textAlign: 'center', opacity: (loading && scenario !== 'student') ? 0.5 : 1,
                transition: 'border 0.2s, box-shadow 0.2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}
              onClick={() => !loading && handleSelectScenario('student')}
            >
              <GraduationCap size={56} color="var(--secondary-magenta)" style={{ display: 'block', margin: '0 auto 20px' }} />
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>Student</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '0.95rem' }}>Priya Sharma · No Account</p>
              <div style={{ marginTop: '20px', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', color: 'var(--text-primary)' }}>
                <span>Ranchi</span> <ArrowRight size={14} /> <span>Pune</span>
              </div>
              <div style={{ marginTop: '20px', padding: '6px 14px', background: '#b0185e18', color: 'var(--secondary-magenta)', borderRadius: '6px', display: 'inline-block', fontSize: '0.85rem', fontWeight: 'bold' }}>
                SIM Roaming Signal
              </div>
              {loading && scenario === 'student' && (
                <p style={{ marginTop: '20px', color: 'var(--highlight-cyan)' }}>Running LLM Agent...</p>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
            <button
              onClick={handleReset}
              style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-secondary)', padding: '10px 20px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
            >
              <RotateCcw size={14} /> Reset Backend State
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Signal Detected */}
      {step === 2 && (
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: 'var(--primary-purple)' }}>Agent Signal Processing</h2>

          {!cityChanged ? (
            <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '25px', maxWidth: '500px', margin: '0 auto' }}>
              <AlertTriangle size={32} color="#f59e0b" style={{ display: 'block', margin: '0 auto 10px' }} />
              <p style={{ color: '#92400e', marginBottom: '15px' }}>
                No city change was detected — the user was already recorded in that city from a previous run.
                Reset the backend state and try the demo again.
              </p>
              <button
                onClick={handleReset}
                style={{ background: 'var(--secondary-magenta)', color: 'white', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={14} /> Reset & Try Again
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '15px 30px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--card-border)', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {prevCity}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--secondary-magenta)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>{result?.source || 'SIGNAL'}</span>
                  <ArrowRight size={24} />
                </div>
                <div style={{ padding: '15px 30px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '2px solid var(--highlight-cyan)', fontWeight: 'bold', color: 'var(--highlight-cyan)' }}>
                  {newCity}
                </div>
              </div>

              {notifMessage && (
                <div style={{ background: 'var(--gradient-banner)', color: 'white', padding: '25px', borderRadius: '8px', maxWidth: '640px', margin: '0 auto', textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '10px', opacity: 0.9, color: 'white' }}>AI-Generated Hyper-Personalized Outreach:</h4>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'white' }}>"{notifMessage}"</p>
                </div>
              )}

              <button
                onClick={() => setStep(3)}
                style={{ marginTop: '30px', background: 'var(--primary-purple)', color: 'white', padding: '12px 30px', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                Proceed to Onboarding Flow
              </button>
            </>
          )}
        </div>
      )}

      {/* Step 3: Onboarding */}
      {step === 3 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '36px', color: 'var(--primary-purple)', fontSize: '1.75rem' }}>Customer Onboarding</h2>

          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '8px', border: '1px solid var(--card-border)', maxWidth: '500px', margin: '0 auto' }}>
            {scenario === 'migrant_worker' ? (
              <>
                <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Reactivate Dormant Account</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Customer clicked the notification link to reactivate their account via Aadhaar OTP.
                </p>
                <input
                  type="text"
                  placeholder="Enter Aadhaar OTP (use 123456)"
                  value={otp}
                  onChange={e => { setOtp(e.target.value); setOtpError(null); }}
                  maxLength={6}
                  style={{
                    width: '100%', padding: '12px',
                    border: otpError ? '1px solid #f87171' : '1px solid var(--card-border)',
                    borderRadius: '4px', marginBottom: '8px',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)'
                  }}
                />
                {/* Inline OTP error */}
                {otpError && (
                  <p style={{ color: '#b91c1c', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'left' }}>
                    ⚠ {otpError}
                  </p>
                )}
                <button
                  onClick={handleReactivate}
                  disabled={loading || !otp.trim()}
                  style={{
                    width: '100%', background: 'var(--gradient-btn)', color: 'white',
                    padding: '12px', borderRadius: '4px', fontWeight: 'bold',
                    opacity: (loading || !otp.trim()) ? 0.6 : 1,
                    cursor: (loading || !otp.trim()) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Verifying OTP...' : 'Verify OTP & Reactivate Account'}
                </button>
              </>
            ) : (
              <>
                <h3 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Open Insta Savings Account</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Customer clicked the notification link. Verify Aadhaar OTP to open a new digital account in {newCity}.
                </p>
                <input
                  type="text"
                  placeholder="Enter Aadhaar OTP (use 123456)"
                  value={otp}
                  onChange={e => { setOtp(e.target.value); setOtpError(null); }}
                  maxLength={6}
                  style={{
                    width: '100%', padding: '12px',
                    border: otpError ? '1px solid #f87171' : '1px solid var(--card-border)',
                    borderRadius: '4px', marginBottom: '8px',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)'
                  }}
                />
                {/* Inline OTP error */}
                {otpError && (
                  <p style={{ color: '#b91c1c', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'left' }}>
                    ⚠ {otpError}
                  </p>
                )}
                <button
                  onClick={handleOpenAccount}
                  disabled={loading || !otp.trim()}
                  style={{
                    width: '100%', background: 'var(--gradient-btn)', color: 'white',
                    padding: '12px', borderRadius: '4px', fontWeight: 'bold',
                    opacity: (loading || !otp.trim()) ? 0.6 : 1,
                    cursor: (loading || !otp.trim()) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Verifying OTP...' : 'Verify OTP & Open Account'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 4 && (
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <CheckCircle size={72} color="#4ade80" style={{ display: 'block', margin: '0 auto 24px' }} />
          <h2 style={{ marginBottom: '10px', color: 'var(--primary-purple)' }}>Journey Complete!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            {scenario === 'migrant_worker'
              ? `Ramesh successfully reactivated his account after relocating from ${prevCity} to ${newCity}.`
              : `Priya successfully opened her new Insta Savings Account in ${newCity}.`}
          </p>
          <button
            onClick={handleReset}
            style={{ background: 'transparent', border: '2px solid var(--card-border)', color: 'var(--text-primary)', padding: '10px 24px', borderRadius: '4px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} /> Reset Demo & Run Again
          </button>
        </div>
      )}

    </div>
  );
}

export default function DemoPage({ lastSignal }) {
  return (
    <ErrorBoundary>
      <DemoPageInner lastSignal={lastSignal} />
    </ErrorBoundary>
  );
}

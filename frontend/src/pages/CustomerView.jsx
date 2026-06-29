import React, { useState, useEffect } from 'react';
import { getState, reactivateAccount, setupRemittance, openAccount, updateConsent } from '../services/api';
import { Smartphone, CheckCircle, ShieldAlert, Languages, Shield, PiggyBank, CreditCard, ArrowRight, Settings, LogOut, Key } from 'lucide-react';

const TRANSLATIONS = {
  English: {
    status: 'Status',
    active: 'ACTIVE',
    dormant: 'DORMANT',
    none: 'NO ACCOUNT',
    aadhaarRequired: 'Aadhaar Reactivation Required',
    enterOtp: 'Enter Aadhaar OTP',
    verifyBtn: 'Verify & Reactivate',
    openAccHeader: 'Open SBI Insta Student Account',
    kycBtn: 'Open Account via Video KYC',
    initDeposit: 'Initial Deposit (₹)',
    univName: 'University Name',
    sendMoneyHeader: 'Send Money Home (Remittance)',
    beneficiaryName: 'Beneficiary Name',
    accNo: 'Account Number',
    amount: 'Amount (₹)',
    setupTransferBtn: 'Setup Transfer',
    studentDashHeader: 'Student Digital Hub',
    pocketMoneyHeader: 'Request Pocket Money',
    parentUpi: 'Parent UPI ID',
    requestBtn: 'Send Request to Parent',
    loanHeader: 'Pre-Approved Scholar Loan',
    loanSub: 'Exclusive student rate for {city}: 8.15% p.a.',
    applyLoanBtn: 'Apply Instantly',
    privacyHeader: 'Privacy & Consent Center',
    consentUpi: 'UPI Address Changes',
    consentAtm: 'ATM Geolocation alerts',
    consentSim: 'SIM Roaming alerts',
    savePrivacy: 'Save Privacy Settings',
    waiting: 'Waiting for signals...',
    toastReactivated: 'Account Successfully Reactivated!',
    toastRemittance: 'Remittance Schedule Created!',
    toastOpenSuccess: 'SBI Insta Student Account Opened!',
    toastLoanApplied: 'Education Loan Application Submitted!',
    toastRequestSent: 'Pocket Money Request Sent!',
    toastPrivacySaved: 'Privacy settings updated on ledger.',
    loanStatusApproved: 'Application Submitted (Ref: SCH-9018)',
    settingsBtn: 'Privacy settings',
    logoutBtn: 'Log Out',
    loginHeader: 'Login to YONO',
    phoneLabel: 'Enter Mobile Number',
    sendOtpBtn: 'Send Verification OTP',
    otpLabel: 'Enter 6-digit OTP',
    loginBtn: 'Verify & Log In',
    quickFill: 'Quick-Fill Mock Accounts:'
  },
  Hindi: {
    status: 'स्थिति',
    active: 'सक्रिय',
    dormant: 'निष्क्रिय',
    none: 'कोई खाता नहीं',
    aadhaarRequired: 'आधार पुनर्सक्रियन आवश्यक',
    enterOtp: 'आधार ओटीपी दर्ज करें',
    verifyBtn: 'सत्यापित करें और सक्रिय करें',
    openAccHeader: 'SBI इंस्टा छात्र खाता खोलें',
    kycBtn: 'वीडियो केवाईसी द्वारा खाता खोलें',
    initDeposit: 'प्रारंभिक जमा (₹)',
    univName: 'विश्वविद्यालय का नाम',
    sendMoneyHeader: 'घर पैसे भेजें (Remittance)',
    beneficiaryName: 'लाभार्थी का नाम',
    accNo: 'खाता संख्या',
    amount: 'राशि (₹)',
    setupTransferBtn: 'स्थानांतरण सेट करें',
    studentDashHeader: 'छात्र डिजिटल हब',
    pocketMoneyHeader: 'पॉकेट मनी का अनुरोध करें',
    parentUpi: 'अभिभावक UPI आईडी',
    requestBtn: 'अभिभावक को अनुरोध भेजें',
    loanHeader: 'प्री-स्वीकृत स्कॉलर लोन',
    loanSub: '{city} के लिए विशेष छात्र दर: 8.15% वार्षिक',
    applyLoanBtn: 'तुरंत आवेदन करें',
    privacyHeader: 'गोपनीयता और सहमति केंद्र',
    consentUpi: 'UPI पता परिवर्तन',
    consentAtm: 'ATM भू-स्थान अलर्ट',
    consentSim: 'SIM रोमिंग अलर्ट',
    savePrivacy: 'गोपनीयता सेटिंग्स सहेजें',
    waiting: 'संकेतों की प्रतीक्षा की जा रही है...',
    toastReactivated: 'खाता सफलतापूर्वक पुन: सक्रिय हो गया!',
    toastRemittance: 'प्रेषण अनुसूची सफलतापूर्वक बनाई गई!',
    toastOpenSuccess: 'SBI इंस्टा छात्र खाता सफलतापूर्वक खोला गया!',
    toastLoanApplied: 'शिक्षा ऋण आवेदन जमा किया गया!',
    toastRequestSent: 'पॉकेट मनी अनुरोध भेजा गया!',
    toastPrivacySaved: 'गोपनीयता सेटिंग्स अपडेट की गईं।',
    loanStatusApproved: 'आवेदन जमा कर दिया गया (संदर्भ: SCH-9018)',
    settingsBtn: 'गोपनीयता सेटिंग्स',
    logoutBtn: 'लॉग आउट',
    loginHeader: 'योनो में लॉग इन करें',
    phoneLabel: 'मोबाइल नंबर दर्ज करें',
    sendOtpBtn: 'सत्यापन ओटीपी भेजें',
    otpLabel: '6-अंकीय ओटीपी दर्ज करें',
    loginBtn: 'सत्यापित करें और लॉग इन करें',
    quickFill: 'त्वरित-भरें मॉक खाते:'
  },
  Kannada: {
    status: 'ಸ್ಥಿತಿ',
    active: 'ಸಕ್ರಿಯ',
    dormant: 'ನಿಷ್ಕ್ರಿಯ',
    none: 'ಯಾವುದೇ ಖಾತೆ ಇಲ್ಲ',
    aadhaarRequired: 'ಆಧಾರ್ ಮರುಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆ ಅಗತ್ಯವಿದೆ',
    enterOtp: 'ಆಧಾರ್ ಒಟಿಪಿ ನಮೂದಿಸಿ',
    verifyBtn: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಕ್ರಿಯಗೊಳಿಸಿ',
    openAccHeader: 'SBI ಇನ್ಸ್ಟಾ ವಿದ್ಯಾರ್ಥಿ ಖಾತೆ ತೆರೆಯಿರಿ',
    kycBtn: 'ವೀಡಿಯೊ ಕೆವೈಸಿ ಮೂಲಕ ಖಾತೆ ತೆರೆಯಿರಿ',
    initDeposit: 'ಆರಂಭಿಕ ಠೇವಣಿ (₹)',
    univName: 'ವಿಶ್ವವಿದ್ಯಾಲಯದ ಹೆಸರು',
    sendMoneyHeader: 'ಮನೆಗೆ ಹಣ ಕಳುಹಿಸಿ (Remittance)',
    beneficiaryName: 'ಫಲಾನುಭವಿಯ ಹೆಸರು',
    accNo: 'ಖಾತೆ ಸಂಖ್ಯೆ',
    amount: 'ಹಣದ ಪ್ರಮಾಣ (₹)',
    setupTransferBtn: 'ವರ್ಗಾವಣೆ ಹೊಂದಿಸಿ',
    studentDashHeader: 'ವಿದ್ಯಾರ್ಥಿ ಡಿಜಿಟಲ್ ಹಬ್',
    pocketMoneyHeader: 'ಪಾಕೆಟ್ ಮನಿ ವಿನಂತಿಸಿ',
    parentUpi: 'parent UPI ಐಡಿ',
    requestBtn: 'ಪೋಷಕರಿಗೆ ವಿನಂತಿ ಕಳುಹಿಸಿ',
    loanHeader: 'ಪೂರ್ವ-ಅನುಮೋದಿತ ವಿದ್ಯಾರ್ಥಿ ಸಾಲ',
    loanSub: '{city} ಗೆ ವಿಶೇಷ ವಿದ್ಯಾರ್ಥಿ ದರ: 8.15% ವಾರ್ಷಿಕ',
    applyLoanBtn: 'ತಕ್ಷಣ ಅನ್ವಯಿಸಿ',
    privacyHeader: 'ಗೌಪ್ಯತೆ ಮತ್ತು ಸಮ್ಮತಿ ಕೇಂದ್ರ',
    consentUpi: 'UPI ವಿಳಾಸ ಬದಲಾವಣೆಗಳು',
    consentAtm: 'ATM ಸ್ಥಳ ಮಾಹಿತಿ ಅಲರ್ಟ್',
    consentSim: 'SIM ರೋಮಿಂಗ್ ಅಲರ್ಟ್',
    savePrivacy: 'ಗೌಪ್ಯತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಿ',
    waiting: 'ಏಜೆಂಟ್ ಸಂಕೇತಗಳಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...',
    toastReactivated: 'ಖಾತೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮರುಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ!',
    toastRemittance: 'ಹಣ ರವಾನೆ ವೇಳಾಪಟ್ಟಿ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!',
    toastOpenSuccess: 'SBI ಇನ್ಸ್ಟಾ ವಿದ್ಯಾರ್ಥಿ ಖಾತೆಯನ್ನು ತೆರೆಯಲಾಗಿದೆ!',
    toastLoanApplied: 'ಶಿಕ್ಷಣ ಸಾಲದ ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!',
    toastRequestSent: 'ಪಾಕೆಟ್ ಮನಿ ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ!',
    toastPrivacySaved: 'ಗೌಪ್ಯತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ.',
    loanStatusApproved: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ (ಉಲ್ಲೇಖ: SCH-9018)',
    settingsBtn: 'ಗೌಪ್ಯತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    logoutBtn: 'ಲಾಗ್ ಔಟ್',
    loginHeader: 'YONO ಗೆ ಲಾಗಿನ್ ಮಾಡಿ',
    phoneLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    sendOtpBtn: 'ಒಟಿಪಿ ಕಳುಹಿಸಿ',
    otpLabel: '6 ಅಂಕಿಯ ಒಟಿಪಿ ನಮೂದಿಸಿ',
    loginBtn: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಾಗಿನ್ ಮಾಡಿ',
    quickFill: 'ತ್ವರಿತ-ಭರ್ತಿ ಮಾದರಿ ಖಾತೆಗಳು:'
  },
  Telugu: {
    status: 'స్థితి',
    active: 'సక్రియ',
    dormant: 'నిష్క్రియ',
    none: 'ఖాతా లేదు',
    aadhaarRequired: 'ఆధార్ పునరుద్ధరణ అవసరం',
    enterOtp: 'ఆధార్ OTP నమోదు చేయండి',
    verifyBtn: 'ధృవీకరించి పునరుద్ధరించండి',
    openAccHeader: 'SBI ఇన్‌స్టా విద్యార్థి ఖాతా తెరువుము',
    kycBtn: 'వీడియో KYC ద్వారా ఖాతా తెరువుము',
    initDeposit: 'ఆరంభ డిపాజిట్ (₹)',
    univName: 'విశ్వవిద్యాలయం పేరు',
    sendMoneyHeader: 'ఇంటికి డబ్బు పంపండి (Remittance)',
    beneficiaryName: 'లబ్ధిదారుని పేరు',
    accNo: 'ఖాతా సంఖ్య',
    amount: 'మొత్తం (₹)',
    setupTransferBtn: 'బదిలీని సెటప్ చేయండి',
    studentDashHeader: 'విద్యార్థి డిజిటల్ హబ్',
    pocketMoneyHeader: 'పాకెట్ మనీ అభ్యర్థించండి',
    parentUpi: 'తల్లిదండ్రుల UPI ఐడి',
    requestBtn: 'తల్లిదండ్రులకు అభ్యర్థన పంపండి',
    loanHeader: 'ముందుగా ఆమోదించబడిన విద్యార్థి రుణం',
    loanSub: '{city} లో విద్యార్థులకు ప్రత్యేక వడ్డీ రేటు: 8.15% సంవత్సరానికి',
    applyLoanBtn: 'వెంటనే దరఖాస్తు చేసుకోండి',
    privacyHeader: 'గోప్యత & సమ్మతి కేంద్రం',
    consentUpi: 'UPI చిరునామా మార్పులు',
    consentAtm: 'ATM లొకేషన్ అలర్ట్లు',
    consentSim: 'SIM రోమింగ్ అలర్ట్లు',
    savePrivacy: 'గోప్యతా సెట్టింగులను సేవ్ చేయి',
    waiting: 'సిగ్నల్స్ కోసం ఎదురుచూస్తోంది...',
    toastReactivated: 'ఖాతా విజయవంతంగా పునరుద్ధరించబడింది!',
    toastRemittance: 'డబ్బు పంపే షెడ్యూల్ విజయవంతంగా సృష్టించబడింది!',
    toastOpenSuccess: 'SBI ఇన్‌స్టా విద్యార్థి ఖాతా విజయవంతంగా తెరవబడింది!',
    toastLoanApplied: 'విద్యా రుణ దరఖాస్తు సమర్పించబడింది!',
    toastRequestSent: 'పాకెట్ మనీ అభ్యర్థన పంపబడింది!',
    toastPrivacySaved: 'గోప్యతా సెట్టింగులు నవీకరించబడ్డాయి.',
    loanStatusApproved: 'దరఖాస్తు సమర్పించబడింది (రిఫరెన్స్: SCH-9018)',
    settingsBtn: 'గోప్యతా సెట్టింగ్లు',
    logoutBtn: 'లాగ్ అవుట్',
    loginHeader: 'YONO కు లాగిన్ అవ్వండి',
    phoneLabel: 'మొబైల్ సంఖ్యను నమోదు చేయండి',
    sendOtpBtn: 'OTP పంపించు',
    otpLabel: '6 అంకెల OTP నమోదు చేయండి',
    loginBtn: 'ధృవీకరించి లాగిన్ అవ్వండి',
    quickFill: 'త్వరిత-భర్తీ నమూనా ఖాతాలు:'
  }
};

export default function CustomerView({ isEmbedded = false }) {
  // Authentication states
  const [loggedInPhone, setLoggedInPhone] = useState(null);
  const [inputPhone, setInputPhone] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [preSelectedLang, setPreSelectedLang] = useState('English');

  // Business state
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [otp, setOtp] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Privacy and Settings UI
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [consent, setConsent] = useState({ UPI: true, ATM: true, SIM: true });

  // Value-adds
  const [kycData, setKycData] = useState({ initialDeposit: 1000, universityName: '' });
  const [parentUpi, setParentUpi] = useState('');
  const [pocketMoneyAmount, setPocketMoneyAmount] = useState('');
  const [loanApplied, setLoanApplied] = useState(false);

  const [remittanceData, setRemittanceData] = useState({
    beneficiaryName: '',
    beneficiaryAccount: '',
    amount: ''
  });

  const [isSaathiOpen, setIsSaathiOpen] = useState(false);
  const [saathiMessages, setSaathiMessages] = useState([]);
  const [saathiInput, setSaathiInput] = useState('');
  const [saathiTyping, setSaathiTyping] = useState(false);

  const handleSendQuickMessage = async (text) => {
    const userMsg = { sender: 'user', text };
    setSaathiMessages(prev => [...prev, userMsg]);
    setSaathiTyping(true);

    try {
      const res = await fetch('/api/saathi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, message: text })
      });
      const data = await res.json();
      setSaathiMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
    } catch (e) {
      setSaathiMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting right now. Please try again.' }]);
    } finally {
      setSaathiTyping(false);
    }
  };

  const fetchState = async () => {
    if (!loggedInPhone) return;
    try {
      const data = await getState();
      if (data && data.users && data.users.length > 0) {
        const targetUser = data.users.find(u => u.phone === loggedInPhone);
        if (targetUser) {
          setUser(targetUser);
          setConsent(targetUser.consent || { UPI: true, ATM: true, SIM: true });

          // Find latest notification specifically for this user
          const userNotifications = (data.notifications || []).filter(n => n.userId === targetUser.id);
          const latestNotif = userNotifications.length > 0 
            ? userNotifications[userNotifications.length - 1] 
            : null;
          setNotification(latestNotif);
        }
      }
    } catch (e) {
      // silently ignore polling errors
    }
  };

  useEffect(() => {
    if (loggedInPhone) {
      fetchState();
      const interval = setInterval(fetchState, 3000);
      return () => clearInterval(interval);
    }
  }, [loggedInPhone]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  // Login methods
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const data = await getState();
      const userExists = data.users.some(u => u.phone === inputPhone);
      if (!userExists) {
        showError('Phone number not registered.');
        return;
      }
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);
      setIsOtpSent(true);
      showSuccess(`SMS Sent: OTP is ${mockOtp}`);
    } catch (err) {
      showError('Failed to verify phone number.');
    }
  };

  const handleVerifyLogin = () => {
    if (inputOtp === generatedOtp || inputOtp === '123456') {
      setLoggedInPhone(inputPhone);
      showSuccess('Successfully logged in.');
    } else {
      showError('Incorrect OTP. Try 123456');
    }
  };

  const handleLogout = () => {
    setLoggedInPhone(null);
    setInputPhone('');
    setInputOtp('');
    setGeneratedOtp(null);
    setIsOtpSent(false);
    setUser(null);
    setNotification(null);
    setShowPrivacy(false);
    setLoanApplied(false);
    setIsSaathiOpen(false);
    setSaathiMessages([]);
    setSaathiInput('');
    setSaathiTyping(false);
  };

  const handleReactivate = async () => {
    if (!user) return;
    try {
      const res = await reactivateAccount(user.phone, otp);
      if (res && res.error) {
        showError(res.error);
        return;
      }
      showSuccess(t('toastReactivated'));
      fetchState();
    } catch (e) {
      showError('Error reactivating account.');
    }
  };

  const handleOpenAccount = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await openAccount({
        phone: user.phone,
        name: user.name,
        aadhaar: user.aadhaar,
        preferredLanguage: user.preferredLanguage,
        initialDeposit: kycData.initialDeposit,
        currentCity: user.currentCity,
        segment: user.segment
      });
      if (res && res.error) {
        showError(res.error);
        return;
      }
      showSuccess(t('toastOpenSuccess'));
      fetchState();
    } catch (e) {
      showError('Error opening account.');
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
      showSuccess(t('toastRemittance'));
      fetchState();
    } catch (e) {
      showError('Error setting up remittance.');
    }
  };

  const handleSavePrivacy = async () => {
    if (!user) return;
    try {
      const res = await updateConsent(user.phone, consent);
      if (res && res.error) {
        showError(res.error);
        return;
      }
      showSuccess(t('toastPrivacySaved'));
      setShowPrivacy(false);
      fetchState();
    } catch (e) {
      showError('Error updating privacy consent.');
    }
  };

  const handleRequestPocketMoney = (e) => {
    e.preventDefault();
    showSuccess(t('toastRequestSent'));
    setParentUpi('');
    setPocketMoneyAmount('');
  };

  const handleApplyLoan = () => {
    setLoanApplied(true);
    showSuccess(t('toastLoanApplied'));
  };

  const accountStatus = user?.accountStatus || 'none';
  const lang = loggedInPhone ? (user?.preferredLanguage || 'English') : preSelectedLang;
  
  const t = (key) => {
    const langDict = TRANSLATIONS[lang] || TRANSLATIONS['English'];
    return langDict[key] || TRANSLATIONS['English'][key];
  };

  const handleQuickFill = (phone) => {
    setInputPhone(phone);
  };

  const renderPhoneBody = () => {
    // If not logged in, render Login View
    if (!loggedInPhone) {
      return (
        <div style={{ color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '15px', height: '100%', justifyContent: 'space-between' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: 'var(--primary-purple)' }}>{t('loginHeader')}</h3>
              
              {/* Language Switcher on Login Screen */}
              <select 
                value={preSelectedLang} 
                onChange={e => setPreSelectedLang(e.target.value)}
                style={{ padding: '4px', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                <option value="English">EN</option>
                <option value="Hindi">HI</option>
                <option value="Kannada">KN</option>
                <option value="Telugu">TE</option>
              </select>
            </div>

            {/* Simulated SMS Alert inside Phone Frame */}
            {generatedOtp && (
              <div style={{
                background: '#e0f2fe',
                border: '1px solid #7dd3fc',
                color: '#0369a1',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                lineHeight: '1.4',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Key size={16} />
                <span><strong>SMS:</strong> SBI login verification OTP is <strong>{generatedOtp}</strong></span>
              </div>
            )}

            {!isOtpSent ? (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>{t('phoneLabel')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={inputPhone}
                    onChange={e => setInputPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ width: '100%', padding: '12px', background: 'var(--primary-purple)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {t('sendOtpBtn')}
                </button>
              </form>
            ) : (
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>{t('otpLabel')}</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit OTP"
                    value={inputOtp}
                    onChange={e => setInputOtp(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px' }}
                  />
                </div>
                <button
                  onClick={handleVerifyLogin}
                  style={{ width: '100%', padding: '12px', background: 'var(--gradient-btn)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px' }}
                >
                  {t('loginBtn')}
                </button>
                <button
                  onClick={() => setIsOtpSent(false)}
                  style={{ width: '100%', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Change Mobile Number
                </button>
              </div>
            )}
          </div>

          {/* Quick-fill items */}
          <div style={{ borderTop: '1px dashed var(--card-border)', paddingTop: '15px', marginTop: '20px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>{t('quickFill')}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => handleQuickFill('9876543210')}
                style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '4px', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                <span>Ramesh Kumar (Worker)</span>
                <strong>Patna ➡️ Blr</strong>
              </button>
              <button 
                onClick={() => handleQuickFill('9876543211')}
                style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '4px', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                <span>Priya Sharma (Student)</span>
                <strong>Ranchi ➡️ Pune</strong>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', marginTop: '50px' }}>
          <div style={{ margin: '0 auto 20px', width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--text-secondary)', borderTopColor: 'var(--primary-purple)', animation: 'spin 1s linear infinite' }} />
          <p>{t('waiting')}</p>
        </div>
      );
    }

    if (showPrivacy) {
      return (
        <div style={{ color: 'var(--text-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Shield size={20} color="var(--primary-purple)" />
            <h3 style={{ margin: 0 }}>{t('privacyHeader')}</h3>
          </div>
          
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '25px', lineHeight: '1.4' }}>
            Toggle consents for location and transactional metadata alerts. Toggling an option off blocks SBI from receiving corresponding network updates.
          </p>

          {['UPI', 'ATM', 'SIM'].map(sourceName => {
            const translationKey = sourceName === 'UPI' ? 'consentUpi' : sourceName === 'ATM' ? 'consentAtm' : 'consentSim';
            return (
              <div key={sourceName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--card-border)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{t(translationKey)}</span>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '22px' }}>
                  <input
                    type="checkbox"
                    checked={consent[sourceName]}
                    onChange={e => setConsent({ ...consent, [sourceName]: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: consent[sourceName] ? 'var(--primary-purple)' : '#ccc',
                    transition: '.3s', borderRadius: '22px'
                  }}>
                    <span style={{
                      position: 'absolute', content: '""', height: '16px', width: '16px', left: '3px', bottom: '3px',
                      backgroundColor: 'white', transition: '.3s', borderRadius: '50%',
                      transform: consent[sourceName] ? 'translateX(22px)' : 'none'
                    }} />
                  </span>
                </label>
              </div>
            );
          })}

          <button
            onClick={handleSavePrivacy}
            style={{ width: '100%', padding: '12px', background: 'var(--primary-purple)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}
          >
            {t('savePrivacy')}
          </button>
          
          <button
            onClick={() => setShowPrivacy(false)}
            style={{ width: '100%', padding: '10px', background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', marginTop: '10px', fontSize: '0.85rem' }}
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>Hi, {user.name}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              {t('status')}:
              <span style={{
                color: accountStatus === 'dormant' ? '#ef4444' : accountStatus === 'active' ? '#22c55e' : '#f59e0b',
                fontWeight: 'bold',
                marginLeft: '5px'
              }}>
                {t(accountStatus)}
              </span>
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setShowPrivacy(true)}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '5px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', color: 'var(--text-primary)', cursor: 'pointer' }}
              title={t('settingsBtn')}
            >
              <Settings size={14} />
            </button>
            <button
              onClick={handleLogout}
              style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '5px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', color: '#b91c1c', cursor: 'pointer' }}
              title={t('logoutBtn')}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* AI Notification Card */}
        {notification && (
          <div style={{
            background: 'var(--gradient-banner)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            marginTop: '15px',
            fontSize: '0.85rem',
            lineHeight: '1.4',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', marginBottom: '4px', color: 'white' }}>
              <Languages size={14} color="white" />
              <span>SBI Outreach ({notification.language})</span>
            </div>
            <p style={{ margin: 0, color: 'white' }}>{notification.message}</p>
          </div>
        )}

        {/* 1. Account Onboarding (None Status) */}
        {accountStatus === 'none' && (
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid var(--card-border)', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
            <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PiggyBank size={18} />
              {t('openAccHeader')}
            </h4>
            <form onSubmit={handleOpenAccount}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t('initDeposit')}</label>
                <input
                  type="number"
                  value={kycData.initialDeposit}
                  onChange={e => setKycData({ ...kycData, initialDeposit: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t('univName')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune University"
                  value={kycData.universityName}
                  onChange={e => setKycData({ ...kycData, universityName: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
              </div>
              <button
                type="submit"
                style={{ width: '100%', background: 'var(--primary-purple)', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {t('kycBtn')}
              </button>
            </form>
          </div>
        )}

        {/* 2. Dormant Account Reactivation */}
        {accountStatus === 'dormant' && (
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid var(--card-border)', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', color: '#ef4444' }}>
              <ShieldAlert size={20} />
              <strong>{t('aadhaarRequired')}</strong>
            </div>
            <input
              type="text"
              placeholder={t('enterOtp')}
              value={otp}
              onChange={e => setOtp(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid var(--card-border)', borderRadius: '4px', marginBottom: '10px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
            <button
              onClick={handleReactivate}
              style={{ width: '100%', background: 'var(--primary-purple)', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {t('verifyBtn')}
            </button>
          </div>
        )}

        {/* 3. Active Worker: Remittance Flow */}
        {accountStatus === 'active' && user.segment === 'worker' && (
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid var(--card-border)', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', color: 'var(--secondary-magenta)' }}>
              <CheckCircle size={20} />
              <strong>{t('sendMoneyHeader')}</strong>
            </div>
            <form onSubmit={handleRemittance}>
              <input
                type="text" placeholder={t('beneficiaryName')} required
                value={remittanceData.beneficiaryName}
                onChange={e => setRemittanceData({ ...remittanceData, beneficiaryName: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
              <input
                type="text" placeholder={t('accNo')} required
                value={remittanceData.beneficiaryAccount}
                onChange={e => setRemittanceData({ ...remittanceData, beneficiaryAccount: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
              <input
                type="number" placeholder={t('amount')} required
                value={remittanceData.amount}
                onChange={e => setRemittanceData({ ...remittanceData, amount: e.target.value })}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid var(--card-border)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
              <button
                type="submit"
                style={{ width: '100%', background: 'var(--secondary-magenta)', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {t('setupTransferBtn')}
              </button>
            </form>
          </div>
        )}

        {/* 4. Active Student: Digital Hub */}
        {accountStatus === 'active' && user.segment === 'student' && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ color: 'var(--primary-purple)', margin: '0 0 12px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={18} />
              {t('studentDashHeader')}
            </h4>

            {/* Student Debit Card */}
            <div style={{
              background: 'linear-gradient(135deg, #7F00FF 0%, #FF007F 100%)',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              position: 'relative',
              height: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: 'monospace',
              marginBottom: '20px',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '35px', height: '24px', background: '#FFD700', borderRadius: '4px', opacity: 0.8 }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white' }}>SBI student</span>
              </div>
              <div style={{ fontSize: '1.1rem', letterSpacing: '1.5px', color: 'white' }}>
                4321 •••• •••• 9011
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '0.5rem', textTransform: 'uppercase', opacity: 0.7, color: 'white' }}>Card Holder</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white' }}>{user.name.toUpperCase()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.5rem', textTransform: 'uppercase', opacity: 0.7, color: 'white' }}>Location</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white' }}>{user.currentCity.toUpperCase()}</div>
                </div>
              </div>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Pocket Money Request */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <h5 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{t('pocketMoneyHeader')}</h5>
              <form onSubmit={handleRequestPocketMoney}>
                <input
                  type="text" placeholder={t('parentUpi')} required
                  value={parentUpi}
                  onChange={e => setParentUpi(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid var(--card-border)', borderRadius: '4px', fontSize: '0.8rem', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
                <input
                  type="number" placeholder="Amount (₹)" required
                  value={pocketMoneyAmount}
                  onChange={e => setPocketMoneyAmount(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid var(--card-border)', borderRadius: '4px', fontSize: '0.8rem', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
                <button
                  type="submit"
                  style={{ width: '100%', padding: '8px', background: 'var(--primary-purple)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {t('requestBtn')}
                </button>
              </form>
            </div>

            {/* Education Loan pre-approval */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '15px', borderRadius: '8px' }}>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{t('loanHeader')}</h5>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {t('loanSub').replace('{city}', user.currentCity)}
              </p>
              {loanApplied ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#22c55e', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  <CheckCircle size={14} />
                  <span>{t('loanStatusApproved')}</span>
                </div>
              ) : (
                <button
                  onClick={handleApplyLoan}
                  style={{ width: '100%', padding: '8px', background: 'var(--secondary-magenta)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {t('applyLoanBtn')}
                </button>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const simulatedPhoneContent = (
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
      <div style={{ background: 'var(--primary-purple)', color: 'white', padding: '15px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'white' }}>YONO SBI</h2>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '20px', overflowY: 'auto', flex: 1, backgroundColor: 'var(--bg-primary)' }}>
        {renderPhoneBody()}
      </div>

      {/* Floating Chat Button */}
      {loggedInPhone && user && !showPrivacy && !isSaathiOpen && (
        <button
          onClick={() => {
            setIsSaathiOpen(true);
            if (saathiMessages.length === 0) {
              const welcomeText = user.segment === 'worker'
                ? `नमस्ते ${user.name} जी, ${user.currentCity} में आपका स्वागत है। मैं आपका एसबीआई साथी हूँ। नए शहर में किराए के कमरे, कन्नड़ भाषा या पैसे सुरक्षित घर भेजने के बारे में मुझसे पूछें।`
                : `Hi ${user.name}, welcome to ${user.currentCity} for your studies. I am your SBI Saathi companion. Ask me about local hostels, transit passes, Marathi greetings, or student education loans.`;
              setSaathiMessages([{ sender: 'bot', text: welcomeText }]);
            }
          }}
          style={{
            position: 'absolute',
            bottom: '65px',
            right: '20px',
            background: 'var(--secondary-magenta)',
            color: 'white',
            width: '56px',
            height: '56px',
            borderRadius: '28px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            cursor: 'pointer',
            border: '2px solid white'
          }}
        >
          Saathi
        </button>
      )}

      {/* Saathi Chat Screen Overlay */}
      {isSaathiOpen && loggedInPhone && user && (
        <div style={{
          position: 'absolute',
          top: '48px',
          left: 0,
          right: 0,
          bottom: '48px',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1500
        }}>
          <div style={{ background: 'var(--primary-purple)', color: 'white', padding: '12px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ color: 'white', fontSize: '0.85rem' }}>SBI Saathi</strong>
            <button 
              onClick={() => setIsSaathiOpen(false)}
              style={{ background: 'transparent', color: 'white', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>

          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {saathiMessages.map((msg, i) => (
              <div 
                key={i} 
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'user' ? 'var(--secondary-magenta)' : 'var(--bg-secondary)',
                  color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  maxWidth: '85%',
                  fontSize: '0.8rem',
                  lineHeight: '1.4',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--card-border)'
                }}
              >
                {msg.text}
              </div>
            ))}
            {saathiTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: '12px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                Saathi is typing...
              </div>
            )}
          </div>

          <div style={{ padding: '8px 12px', display: 'flex', gap: '8px', overflowX: 'auto', background: 'var(--bg-secondary)', borderTop: '1px solid var(--card-border)', scrollbarWidth: 'none' }}>
            {user.segment === 'worker' ? (
              <>
                <button 
                  onClick={() => handleSendQuickMessage("किराए के कमरे कहाँ मिलेंगे?")}
                  style={{ padding: '6px 12px', background: 'var(--bg-primary)', border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '0.7rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  किराए का कमरा
                </button>
                <button 
                  onClick={() => handleSendQuickMessage("कन्नड़ बोलना सीखें")}
                  style={{ padding: '6px 12px', background: 'var(--bg-primary)', border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '0.7rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  कन्नड़ भाषा सीखें
                </button>
                <button 
                  onClick={() => handleSendQuickMessage("घर पैसे सुरक्षित कैसे भेजें?")}
                  style={{ padding: '6px 12px', background: 'var(--bg-primary)', border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '0.7rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  घर पैसे भेजना
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleSendQuickMessage("Where can I find student housing in Pune?")}
                  style={{ padding: '6px 12px', background: 'var(--bg-primary)', border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '0.7rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  Hostels and PGs
                </button>
                <button 
                  onClick={() => handleSendQuickMessage("Marathi words for daily transit")}
                  style={{ padding: '6px 12px', background: 'var(--bg-primary)', border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '0.7rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  Marathi words
                </button>
                <button 
                  onClick={() => handleSendQuickMessage("Tell me about pre-approved student education loans")}
                  style={{ padding: '6px 12px', background: 'var(--bg-primary)', border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '0.7rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                >
                  Education Loan
                </button>
              </>
            )}
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!saathiInput.trim()) return;
              handleSendQuickMessage(saathiInput);
              setSaathiInput('');
            }}
            style={{ padding: '10px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '8px' }}
          >
            <input 
              type="text" 
              value={saathiInput}
              onChange={e => setSaathiInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--card-border)', borderRadius: '20px', fontSize: '0.8rem', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
            <button 
              type="submit" 
              style={{ padding: '8px 16px', background: 'var(--primary-purple)', color: 'white', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Android Navigation Bar */}
      <div style={{
        height: '48px',
        background: '#000',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid #222'
      }}>
        <div style={{ width: '0', height: '0', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '12px solid #888', cursor: 'pointer' }} onClick={handleLogout} title="Back to Login" />
        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #888', cursor: 'pointer' }} onClick={() => { setShowPrivacy(false); setIsSaathiOpen(false); }} title="Home" />
        <div style={{ width: '14px', height: '14px', border: '2px solid #888', borderRadius: '2px', cursor: 'pointer' }} />
      </div>
      </div>


    </div>
  );

  if (isEmbedded) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {successMsg && (
          <div style={{ position: 'absolute', top: '70px', left: '10px', right: '10px', background: '#22c55e', color: 'white', padding: '8px 12px', borderRadius: '4px', zIndex: 9999, fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ position: 'absolute', top: '70px', left: '10px', right: '10px', background: '#ef4444', color: 'white', padding: '8px 12px', borderRadius: '4px', zIndex: 9999, fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
            {errorMsg}
          </div>
        )}
        {simulatedPhoneContent}
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
      {simulatedPhoneContent}
    </div>
  );
}

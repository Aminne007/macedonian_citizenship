import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RegistrationForm from './components/RegistrationForm';
import PendingCertificate from './components/PendingCertificate';
import CitizenshipCard from './components/CitizenshipCard';
import CitizenLoginModal from './components/CitizenLoginModal';
import AdminPanel from './pages/AdminPanel';
import { Crown, Lock } from 'lucide-react';
import { checkStatus } from './utils/api';

const SESSION_KEY = 'macedonian_citizen_handle';

// ── Main Portal Page ─────────────────────────────────────────────────────────
function PortalPage() {
  // appState: 'form' | 'pending' | 'approved' | 'rejected'
  const [appState, setAppState] = useState('form');
  const [citizenData, setCitizenData] = useState(null);  // form data
  const [serverData, setServerData] = useState(null);    // server-returned data
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const formRef = useRef(null);

  // Restore saved citizen session from localStorage on page refresh
  useEffect(() => {
    const savedHandle = localStorage.getItem(SESSION_KEY);
    if (!savedHandle) return;

    checkStatus(savedHandle).then(result => {
      if (result && result.found) {
        setCitizenData({
          fullName: result.full_name,
          instagram: result.instagram,
          royalTitle: result.royal_title || 'Noble Citizen',
        });
        setServerData({
          national_code: result.national_code,
          approved_at: result.approved_at,
          rejection_note: result.rejection_note,
          submitted_at: result.submitted_at
        });
        if (result.status === 'approved') setAppState('approved');
        else if (result.status === 'rejected') setAppState('rejected');
        else setAppState('pending');
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }).catch(() => {
      // Ignore network errors on restore
    });
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFormSubmit = (data) => {
    if (data?.instagram) {
      localStorage.setItem(SESSION_KEY, data.instagram);
    }
    setCitizenData(data);
    setAppState('pending');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApproved = (data) => {
    setServerData(data);
    setAppState('approved');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRejected = (data) => {
    setServerData(data);
    setAppState('rejected');
  };

  const handleReset = () => {
    localStorage.removeItem(SESSION_KEY);
    setAppState('form');
    setCitizenData(null);
    setServerData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = ({ status, citizenData: cData, serverData: sData }) => {
    if (cData?.instagram) {
      localStorage.setItem(SESSION_KEY, cData.instagram);
    }
    setCitizenData(cData);
    setServerData(sData);
    if (status === 'approved') {
      setAppState('approved');
    } else if (status === 'rejected') {
      setAppState('rejected');
    } else {
      setAppState('pending');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090514] text-[#F8F9FA] relative flex flex-col overflow-x-hidden">
      <ParticleBackground />
      <Navbar onScrollToForm={scrollToForm} onOpenLogin={() => setIsLoginOpen(true)} />

      <main className="flex-1 relative z-10 w-full">
        {appState === 'form' && (
          <>
            <HeroSection onApplyClick={scrollToForm} />
            <RegistrationForm onSubmitComplete={handleFormSubmit} formRef={formRef} />
          </>
        )}
        {(appState === 'pending' || appState === 'rejected') && citizenData && (
          <PendingCertificate
            citizenData={citizenData}
            onApproved={handleApproved}
            onRejected={handleRejected}
          />
        )}
        {appState === 'approved' && citizenData && (
          <CitizenshipCard
            citizenData={citizenData}
            serverData={serverData}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Citizen Login Modal */}
      <CitizenLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#FFD700]/20 bg-[#06030c]/90 py-8 px-4 text-center backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#FFD700]" />
            <span className="font-cinzel font-bold text-xs gold-gradient-text tracking-widest uppercase">
              The Macedonian Empire Archives
            </span>
          </div>
          <p className="font-garamond italic text-sm text-[#CBD5E1]/60">
            "By the Sun of Macedonia, let honor and loyalty shine across all digital frontiers."
          </p>
          <div className="text-[11px] font-cinzel text-[#CBD5E1]/40 flex items-center justify-center gap-1.5">
            <span>© 334 BC – 2026 AD Imperial Sovereign Court of Pella. All Rights Reserved.</span>
            {/* Hidden Admin Access Button */}
            <Link
              to="/admin"
              className="opacity-30 hover:opacity-100 transition-all p-1 text-[#FFD700] hover:scale-110"
              title="Imperial Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Root App with Router ─────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        {/* Catch-all → back to portal */}
        <Route path="*" element={<PortalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

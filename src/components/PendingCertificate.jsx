import React, { useEffect, useRef, useState } from 'react';
import { Clock3, Crown, Sparkles, RefreshCw, AlertCircle, Loader2, CheckCircle2, X } from 'lucide-react';
import { checkStatus } from '../utils/api';
import { playImperialChime } from '../utils/audio';

export default function PendingCertificate({ citizenData, onApproved, onRejected }) {
  const [status, setStatus] = useState('pending'); // pending | approved | rejected
  const [serverData, setServerData] = useState(null);
  const [lastChecked, setLastChecked] = useState(new Date());
  const [polling, setPolling] = useState(false);
  const intervalRef = useRef(null);

  const poll = async () => {
    setPolling(true);
    try {
      const data = await checkStatus(citizenData.instagram);
      setLastChecked(new Date());
      if (data.found) {
        setServerData(data);
        if (data.status === 'approved') {
          setStatus('approved');
          clearInterval(intervalRef.current);
          playImperialChime();
          setTimeout(() => onApproved(data), 1200);
        } else if (data.status === 'rejected') {
          setStatus('rejected');
          clearInterval(intervalRef.current);
          onRejected(data);
        }
      }
    } catch { /* silently ignore */ }
    setPolling(false);
  };

  useEffect(() => {
    poll();
    intervalRef.current = setInterval(poll, 8000); // poll every 8 seconds
    return () => clearInterval(intervalRef.current);
  }, []);

  const timeAgo = (date) => {
    const secs = Math.floor((Date.now() - date) / 1000);
    if (secs < 5) return 'just now';
    if (secs < 60) return `${secs}s ago`;
    return `${Math.floor(secs / 60)}m ago`;
  };

  return (
    <section className="min-h-screen py-12 px-4 sm:px-6 flex flex-col items-center justify-center relative z-10">
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border font-cinzel font-bold text-xs tracking-wider uppercase mb-6 ${
        status === 'pending'
          ? 'bg-[#1a0840] border-[#FFD700]/60 text-[#FFD700]'
          : status === 'approved'
          ? 'bg-emerald-900/50 border-emerald-400 text-emerald-300'
          : 'bg-red-900/50 border-red-400 text-red-300'
      }`}>
        {status === 'pending' && <Clock3 className="w-4 h-4 animate-pulse" />}
        {status === 'approved' && <CheckCircle2 className="w-4 h-4" />}
        {status === 'rejected' && <X className="w-4 h-4" />}
        {status === 'pending' ? 'Awaiting Royal Approval' : status === 'approved' ? 'Approved!' : 'Application Rejected'}
      </div>

      <h2 className="font-cinzel font-extrabold text-3xl sm:text-4xl text-white text-center mb-2">
        {status === 'pending' ? 'YOUR APPLICATION IS UNDER REVIEW' : status === 'approved' ? 'CITIZENSHIP GRANTED' : 'APPLICATION REJECTED'}
      </h2>
      <p className="font-garamond italic text-lg text-[#CBD5E1]/80 text-center max-w-lg mb-10">
        {status === 'pending'
          ? 'The Imperial Court is deliberating. Your certificate will be revealed upon royal approval.'
          : status === 'approved'
          ? 'Your loyalty has been accepted. Welcome to the Empire.'
          : `Your application has been declined by the Imperial Court.`}
      </p>

      {/* BLURRED CERTIFICATE PREVIEW */}
      <div className="relative w-full max-w-xl mx-auto mb-8">
        {/* Blurred card overlay */}
        <div className={`imperial-card-wrap text-left flex flex-col justify-between relative overflow-hidden transition-all duration-700 ${
          status === 'pending' ? 'blur-md brightness-50 select-none pointer-events-none' : ''
        }`}>
          <div className="card-pattern-overlay" />
          <div className="card-gold-border-inner" />

          {/* Card Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#FFD700]/30 pb-3">
            <div className="flex items-center gap-3">
              <div className="gold-wax-seal !w-11 !h-11">
                <svg viewBox="0 0 100 100" className="w-7 h-7">
                  <circle cx="50" cy="50" r="16" fill="#090514" />
                  <g stroke="#FFD700" strokeWidth="3">
                    <line x1="50" y1="10" x2="50" y2="90" /><line x1="10" y1="50" x2="90" y2="50" />
                    <line x1="22" y1="22" x2="78" y2="78" /><line x1="22" y1="78" x2="78" y2="22" />
                  </g>
                </svg>
              </div>
              <div>
                <h3 className="font-cinzel font-black text-sm text-white tracking-widest">THE MACEDONIAN EMPIRE</h3>
                <span className="font-cinzel text-[10px] text-[#FFD700] uppercase tracking-wider">Official Citizen Identification</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs text-[#FFF099] font-bold block bg-[#2A085C]/90 px-2.5 py-1 rounded border border-[#FFD700]/40">
                {status === 'approved' && serverData?.national_code ? serverData.national_code : '???-????-????'}
              </span>
              <span className="font-cinzel text-[9px] text-[#CBD5E1]/60 block mt-0.5">PENDING APPROVAL</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="relative z-10 my-5 space-y-2">
            <div>
              <span className="font-cinzel text-[10px] text-[#FFD700] uppercase tracking-wider block">CITIZEN NAME</span>
              <span className="font-cinzel font-bold text-xl gold-gradient-text-bright">{citizenData.fullName}</span>
            </div>
            <div>
              <span className="font-cinzel text-[10px] text-[#CBD5E1]/80 uppercase tracking-wider block">INSTAGRAM</span>
              <span className="font-inter font-semibold text-sm text-[#FFD700]">{citizenData.instagram}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#2A085C] border border-[#FFD700]/50 text-xs font-cinzel font-bold text-[#FFF099]">
              {citizenData.royalTitle}
            </div>
          </div>

          <div className="relative z-10 pt-2 border-t border-[#FFD700]/20 flex items-center justify-between text-[9px] font-cinzel text-[#CBD5E1]/70">
            <span>SOVEREIGN DECREE OF PELLA</span>
            <span className="flex items-center gap-1 text-[#FFD700]"><Crown className="w-3 h-3" /> MACEDONIA 2026</span>
          </div>
        </div>

        {/* Pending Watermark Stamp over blurred card */}
        {status === 'pending' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="rotate-[-20deg] border-4 border-[#FFD700]/80 rounded-lg px-6 py-3 text-center">
              <span className="font-cinzel font-black text-2xl text-[#FFD700] tracking-widest uppercase block drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]">
                PENDING
              </span>
              <span className="font-cinzel text-xs text-[#FFD700]/70 uppercase tracking-wider block">Awaiting Imperial Review</span>
            </div>
          </div>
        )}
      </div>

      {/* Polling info / manual refresh */}
      {status === 'pending' && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[#CBD5E1]/50 font-inter">
            {polling ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFD700]" /> Checking royal registry...</>
            ) : (
              <><Clock3 className="w-3.5 h-3.5 text-[#FFD700]" /> Last checked: {timeAgo(lastChecked)}</>
            )}
          </div>
          <button
            onClick={poll}
            disabled={polling}
            className="btn-outline-gold !py-2 !px-5 !text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${polling ? 'animate-spin' : ''}`} />
            Check Status Now
          </button>
          <p className="text-[11px] text-[#CBD5E1]/40 font-inter text-center max-w-xs mt-1">
            Status is checked automatically every 8 seconds. You may close this page and return later — use your Instagram handle to look up your status.
          </p>
        </div>
      )}

      {/* Rejection message */}
      {status === 'rejected' && (
        <div className="max-w-md mx-auto glass-card p-5 text-center border-red-500/30">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <h4 className="font-cinzel font-bold text-base text-red-300 mb-1">Application Declined</h4>
          {serverData?.rejection_note && (
            <p className="font-garamond italic text-[#CBD5E1]/80 text-sm">{serverData.rejection_note}</p>
          )}
        </div>
      )}
    </section>
  );
}

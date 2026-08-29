import React, { useState } from 'react';
import { Shield, Search, Loader2, Crown, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { checkStatus } from '../utils/api';
import { playImperialChime } from '../utils/audio';

export default function CitizenLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [handleInput, setHandleInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let formatted = handleInput.trim();
    if (!formatted) return;
    if (!formatted.startsWith('@')) formatted = `@${formatted}`;

    if (formatted.length < 4) {
      setError('Please enter a valid Instagram handle (e.g. @alexander)');
      return;
    }

    setLoading(true);
    playImperialChime();

    try {
      const result = await checkStatus(formatted);
      if (!result.found) {
        setError(`No application found for ${formatted}. Please submit a citizenship petition.`);
      } else {
        onLoginSuccess({
          status: result.status,
          citizenData: {
            fullName: result.full_name,
            instagram: result.instagram,
            royalTitle: result.royal_title || 'Noble Citizen',
          },
          serverData: {
            national_code: result.national_code,
            approved_at: result.approved_at,
            rejection_note: result.rejection_note,
            submitted_at: result.submitted_at
          }
        });
        onClose();
      }
    } catch {
      setError('Failed to reach Imperial Archives. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-2xl border-2 border-[#FFD700] text-center relative shadow-[0_0_50px_rgba(255,215,0,0.2)]">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#120826] border border-[#FFD700]/30 text-[#CBD5E1] hover:text-white transition-all"
        >
          ✕
        </button>

        <div className="w-12 h-12 rounded-full bg-[#2A085C] border border-[#FFD700] flex items-center justify-center mx-auto mb-3">
          <Crown className="w-6 h-6 text-[#FFD700]" />
        </div>

        <h3 className="font-cinzel font-bold text-xl gold-gradient-text mb-1 uppercase">
          Citizen Access Portal
        </h3>
        <p className="font-garamond italic text-sm text-[#CBD5E1]/70 mb-6">
          Enter your registered Instagram handle to view your status or official ID card.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={handleInput}
              onChange={(e) => { setHandleInput(e.target.value); setError(''); }}
              placeholder="@your_instagram"
              className="royal-input text-center text-sm font-inter !py-3"
              autoFocus
            />
            <Search className="w-4 h-4 text-[#FFD700]/60 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {error && (
            <p className="text-xs text-amber-300 font-inter flex items-center justify-center gap-1.5 bg-amber-900/40 p-2.5 rounded-lg border border-amber-500/30">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !handleInput.trim()}
            className="btn-gold !py-3 !px-6 w-full text-sm font-cinzel tracking-wider"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {loading ? 'Searching Pella Archives...' : 'Lookup Citizenship'}
          </button>
        </form>
      </div>
    </div>
  );
}

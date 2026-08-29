import React, { useState, useCallback } from 'react';
import {
  User, Instagram, Calendar, ShieldCheck, CheckCircle2,
  ChevronRight, ChevronLeft, Crown, Sparkles, AlertCircle,
  Scroll, Loader2, Shield, Sword, Mail
} from 'lucide-react';
import { playImperialChime, playSealStampSound, playImperialFanfare } from '../utils/audio';
import { submitApplication, checkStatus } from '../utils/api';

const STEPS = ['Personal', 'Royal Trial', 'Title', 'The Oath'];

const QUIZ = [
  {
    id: 'q1', question: 'How do you respond to a peasant insulting the King?',
    options: ['Tax them immediately', 'Send a lethal DM reply', 'Ignore them']
  },
  {
    id: 'q2', question: 'What is the primary currency of the realm?',
    options: ['Royal Euros', 'Absolute Loyalty', 'Pure Gold']
  },
  {
    id: 'q3', question: 'What is the primary duty of an Imperial Citizen?',
    options: ['Uphold the Macedonian Sun', 'Defend the comment section', 'Pay respects to the Governor']
  }
];

const TITLES = [
  { name: 'Wealthy Noble', icon: '💎', desc: 'Owner of grand estates & patron of lavish court banquets.' },
  { name: 'Royal Advisor', icon: '📜', desc: 'Keeper of imperial secrets, strategist to Alexander the Great.' },
  { name: 'Chief Merchant', icon: '⚖️', desc: 'Master of trade routes spanning from Greece to Persia.' },
  { name: 'Court Jester', icon: '🎭', desc: 'Entertainer of sovereigns with imperial immunity.' },
  { name: 'Commander of the Guard', icon: '⚔️', desc: 'Vanguard defender of the Macedonian Sun and borders.' },
];

export default function RegistrationForm({ onSubmitComplete, formRef }) {
  const [step, setStep] = useState(0); // 0-indexed
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', email: '', instagram: '', age: '',
    q1: '', q2: '', q3: '',
    royalTitle: 'Wealthy Noble',
    oathSworn: false
  });

  const setField = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: null }));
  };

  // ── Instagram: strip extra @ signs, enforce single prefix ───────────────
  const handleInstagramChange = (e) => {
    const stripped = e.target.value.replace(/^@+/, '');
    setField('instagram', stripped ? '@' + stripped : '');
  };

  // ── Duplicate check on instagram blur ───────────────────────────────────
  const handleInstagramBlur = useCallback(async () => {
    const handle = formData.instagram;
    if (!handle || handle === '@' || handle.length < 4) return;
    setCheckingDuplicate(true);
    try {
      const data = await checkStatus(handle);
      if (data.found) {
        const statusMsg = {
          pending: 'This handle already has a pending application awaiting royal review.',
          approved: `This handle is already a registered citizen (${data.national_code}).`,
          rejected: 'This handle was previously rejected. Contact the Imperial Court to appeal.'
        };
        setErrors(prev => ({ ...prev, instagram: statusMsg[data.status] || 'Already registered.' }));
      }
    } catch {
      // Silently skip network errors on duplicate check
    } finally {
      setCheckingDuplicate(false);
    }
  }, [formData.instagram]);

  // ── Validation per step ──────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (step === 0) {
      if (!formData.fullName.trim() || formData.fullName.trim().length < 3)
        errs.fullName = 'Full name must be at least 3 characters.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email))
        errs.email = 'Please enter a valid email address.';
      if (!formData.instagram || formData.instagram === '@' || formData.instagram.length < 5)
        errs.instagram = 'Please enter a valid Instagram username.';
      if (errors.instagram) errs.instagram = errors.instagram; // preserve duplicate error
      const age = Number(formData.age);
      if (!formData.age || isNaN(age) || age < 16 || age > 120)
        errs.age = 'Citizens must be at least 16 years of age.';
    }
    if (step === 1) {
      if (!formData.q1) errs.q1 = 'Required';
      if (!formData.q2) errs.q2 = 'Required';
      if (!formData.q3) errs.q3 = 'Required';
    }
    if (step === 3) {
      if (!formData.oathSworn) errs.oathSworn = 'You must swear the Imperial Oath.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    playImperialChime();
    setStep(s => Math.min(s + 1, 3));
  };

  const handlePrev = () => {
    playImperialChime();
    setStep(s => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await submitApplication({
        full_name: formData.fullName,
        email: formData.email,
        instagram: formData.instagram,
        age: Number(formData.age),
        quiz_answers: { q1: formData.q1, q2: formData.q2, q3: formData.q3 },
        royal_title: formData.royalTitle
      });
      playImperialFanfare();
      onSubmitComplete({ ...formData, submissionId: result.id });
    } catch (err) {
      if (err.error === 'duplicate') {
        setStep(0);
        setErrors({ instagram: err.message });
      } else {
        setErrors({ submit: err.error || 'Server error. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = ((step) / 3) * 100;

  return (
    <section ref={formRef} id="application-form" className="py-10 px-4 sm:px-6 max-w-2xl mx-auto relative z-10">
      <div className="glass-card overflow-hidden">

        {/* Card Top Banner */}
        <div className="bg-gradient-to-r from-[#1a0840] to-[#2A085C] px-6 sm:px-10 py-5 border-b border-[#FFD700]/25">
          <p className="font-cinzel text-[10px] tracking-widest text-[#FFD700]/70 uppercase mb-0.5">Imperial Decree #2026</p>
          <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-white">
            CITIZENSHIP REGISTRATION
          </h2>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              {STEPS.map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-cinzel font-bold border-2 transition-all duration-300 ${
                    i < step ? 'bg-[#FFD700] border-[#FFD700] text-[#0a0514]' :
                    i === step ? 'bg-[#2A085C] border-[#FFD700] text-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.4)]' :
                    'bg-transparent border-[#FFD700]/25 text-[#CBD5E1]/40'
                  }`}>
                    {i < step ? <CheckCircle2 className="w-4 h-4" /> : ['I','II','III','IV'][i]}
                  </div>
                  <span className={`font-cinzel text-[9px] uppercase tracking-wide hidden sm:block ${i === step ? 'text-[#FFD700]' : 'text-[#CBD5E1]/40'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1 rounded-full bg-[#FFD700]/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 sm:px-10 py-8">

          {/* ── STEP 0: Personal Details ── */}
          {step === 0 && (
            <div className="animate-fade-in space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#2A085C] border border-[#FFD700]/40 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="font-cinzel font-semibold text-base text-white">Personal Details</h3>
                  <p className="text-xs text-[#CBD5E1]/60 font-inter">Identify yourself before the Royal Scribe of Pella.</p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="royal-label">Full Legal Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setField('fullName', e.target.value)}
                    placeholder="e.g. Alexander of Pella"
                    className={`royal-input pl-11 ${errors.fullName ? 'border-red-500/60' : ''}`}
                  />
                  <User className="w-4 h-4 text-[#FFD700]/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.fullName && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.fullName}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="royal-label">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setField('email', e.target.value)}
                    placeholder="alexander@macedonia.gov"
                    className={`royal-input pl-11 ${errors.email ? 'border-red-500/60' : ''}`}
                  />
                  <Mail className="w-4 h-4 text-[#FFD700]/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-[#CBD5E1]/50 mt-1 font-inter">Your citizenship status update and official certificate will be delivered to this email.</p>
                {errors.email && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.email}</p>}
              </div>

              {/* Instagram */}
              <div>
                <label className="royal-label">Instagram Username *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={handleInstagramChange}
                    onBlur={handleInstagramBlur}
                    placeholder="@your_handle"
                    className={`royal-input pl-11 pr-10 ${errors.instagram ? 'border-red-500/60' : ''}`}
                  />
                  <Instagram className="w-4 h-4 text-[#FFD700]/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  {checkingDuplicate && (
                    <Loader2 className="w-4 h-4 text-[#FFD700] absolute right-4 top-1/2 -translate-y-1/2 animate-spin" />
                  )}
                </div>
                <p className="text-[11px] text-[#CBD5E1]/50 mt-1 font-inter">Your Instagram handle is your unique citizen identifier — no duplicates allowed.</p>
                {errors.instagram && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.instagram}</p>}
              </div>

              {/* Age */}
              <div>
                <label className="royal-label">Age *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="16" max="120"
                    value={formData.age}
                    onChange={e => setField('age', e.target.value)}
                    placeholder="You must be 16 or older"
                    className={`royal-input pl-11 ${errors.age ? 'border-red-500/60' : ''}`}
                  />
                  <Calendar className="w-4 h-4 text-[#FFD700]/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.age && <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.age}</p>}
              </div>
            </div>
          )}

          {/* ── STEP 1: Royal Trial ── */}
          {step === 1 && (
            <div className="animate-fade-in space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#2A085C] border border-[#FFD700]/40 flex items-center justify-center flex-shrink-0">
                  <Sword className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="font-cinzel font-semibold text-base text-white">The Royal Trial</h3>
                  <p className="text-xs text-[#CBD5E1]/60 font-inter">3 questions to assess your imperial character. Choose wisely.</p>
                </div>
              </div>
              {QUIZ.map((q, idx) => (
                <div key={q.id} className="rounded-xl bg-[#0e0520]/80 border border-[#FFD700]/12 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-[10px] text-[#FFD700]/80 uppercase tracking-widest">Question {idx + 1} of 3</span>
                    {formData[q.id] && <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-inter"><CheckCircle2 className="w-3 h-3" />Answered</span>}
                  </div>
                  <p className="font-cinzel font-semibold text-sm sm:text-base text-white">{q.question}</p>
                  <div className="space-y-2 pt-1">
                    {q.options.map(opt => {
                      const sel = formData[q.id] === opt;
                      return (
                        <div
                          key={opt}
                          onClick={() => { playImperialChime(); setField(q.id, opt); }}
                          className={`quiz-option-card cursor-pointer ${sel ? 'selected' : ''}`}
                        >
                          <div className="radio-circle">{sel && <div className="radio-dot" />}</div>
                          <span className="font-inter text-sm text-[#F8F9FA]">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                  {errors[q.id] && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Select an answer.</p>}
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 2: Title Selection ── */}
          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#2A085C] border border-[#FFD700]/40 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="font-cinzel font-semibold text-base text-white">Royal Title Selection</h3>
                  <p className="text-xs text-[#CBD5E1]/60 font-inter">Choose the title you will bear in the Imperial Registry.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {TITLES.map(t => {
                  const sel = formData.royalTitle === t.name;
                  return (
                    <div
                      key={t.name}
                      onClick={() => { playImperialChime(); setField('royalTitle', t.name); }}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${sel
                        ? 'bg-gradient-to-r from-[#2A085C] to-[#3d0f8a] border-[#FFD700] shadow-[0_0_18px_rgba(255,215,0,0.2)]'
                        : 'bg-[#0e0520]/70 border-[#FFD700]/12 hover:border-[#FFD700]/35'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{t.icon}</span>
                          <h4 className="font-cinzel font-bold text-sm text-[#FFF099]">{t.name}</h4>
                        </div>
                        {sel && <span className="text-[10px] bg-[#FFD700] text-[#0a0514] font-cinzel font-black px-2 py-0.5 rounded-full">SELECTED</span>}
                      </div>
                      <p className="text-xs text-[#CBD5E1]/70 mt-1.5 font-inter pl-9">{t.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 3: The Oath ── */}
          {step === 3 && (
            <div className="animate-fade-in space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#2A085C] border border-[#FFD700]/40 flex items-center justify-center flex-shrink-0">
                  <Scroll className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="font-cinzel font-semibold text-base text-white">The Oath of Allegiance</h3>
                  <p className="text-xs text-[#CBD5E1]/60 font-inter">Affix your seal to complete the registration.</p>
                </div>
              </div>

              {/* Parchment */}
              <div className="rounded-2xl bg-gradient-to-b from-[#1c0c38] to-[#100624] border border-[#FFD700]/35 p-6 text-center">
                <Shield className="w-10 h-10 text-[#FFD700]/30 mx-auto mb-3" />
                <h4 className="font-cinzel font-bold text-base text-[#FFD700] mb-3 tracking-wider uppercase">Sacred Declaration of Allegiance</h4>
                <blockquote className="font-garamond italic text-lg text-[#F8F9FA] leading-relaxed mb-6 px-2">
                  "I solemnly swear to honor the King and uphold the glory of Macedonia across all digital lands."
                </blockquote>
                {/* Glowing Checkbox */}
                <div
                  onClick={() => { formData.oathSworn ? playImperialChime() : playSealStampSound(); setField('oathSworn', !formData.oathSworn); }}
                  className={`oath-checkbox-container cursor-pointer flex items-center gap-4 text-left transition-all ${formData.oathSworn ? 'border-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.25)]' : ''}`}
                >
                  <div className={`custom-checkbox ${formData.oathSworn ? 'checked' : ''}`}>
                    {formData.oathSworn && <CheckCircle2 className="w-5 h-5 text-[#0a0514]" />}
                  </div>
                  <div>
                    <span className="font-cinzel font-bold text-sm text-white block">I solemnly swear this oath.</span>
                    <span className="text-[11px] text-[#CBD5E1]/60 font-inter">Click to stamp with your royal seal.</span>
                  </div>
                </div>
                {errors.oathSworn && <p className="text-xs text-red-400 mt-3 flex items-center justify-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.oathSworn}</p>}
              </div>

              {/* Summary Preview */}
              <div className="rounded-xl bg-[#0e0520]/80 border border-[#FFD700]/15 p-4 grid grid-cols-2 gap-4 text-xs font-cinzel">
                <div>
                  <span className="text-[#CBD5E1]/50 block mb-0.5">APPLICANT</span>
                  <span className="font-bold text-white">{formData.fullName}</span>
                  <span className="text-[#FFD700] block">{formData.instagram}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#CBD5E1]/50 block mb-0.5">TITLE</span>
                  <span className="font-bold text-[#FFD700]">{formData.royalTitle}</span>
                  <span className="text-[#CBD5E1]/60 block">Age: {formData.age}</span>
                </div>
              </div>

              {errors.submit && (
                <div className="rounded-lg bg-red-900/30 border border-red-500/40 px-4 py-3 text-xs text-red-400 text-center font-inter">
                  {errors.submit}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="px-6 sm:px-10 pb-8 flex items-center justify-between">
          {step > 0 ? (
            <button type="button" onClick={handlePrev} className="btn-outline-gold !py-2.5 !px-5 !text-sm">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button type="button" onClick={handleNext} className="btn-gold !py-3 !px-7 !text-sm">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-gold !py-3 !px-8 !text-sm disabled:opacity-60"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Sparkles className="w-4 h-4" /> Submit Application</>}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Crown, Sparkles, Scroll, ArrowDown, ShieldCheck, Award, FileText, CheckCircle } from 'lucide-react';
import { playImperialChime } from '../utils/audio';

export default function HeroSection({ onApplyClick }) {
  const handleCtaClick = () => {
    playImperialChime();
    onApplyClick();
  };

  return (
    <section className="relative pt-8 pb-16 px-3 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto z-10">
      
      {/* Prominent Citizenship Banner Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c0c38]/90 border border-[#FFD700]/50 text-[#FFD700] text-xs sm:text-sm font-cinzel font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(255,215,0,0.25)] animate-pulse">
        <Award className="w-4 h-4 text-[#FFD700]" />
        <span>Official Macedonian Imperial Citizenship Portal</span>
      </div>

      {/* Royal Crest Aura & Emblem */}
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 rounded-full bg-[#FFD700]/20 blur-2xl animate-pulse"></div>
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-to-b from-[#3b0f7d] to-[#170733] border-2 border-[#FFD700] p-3 sm:p-4 flex items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.4)]">
          {/* Animated Macedonian Sun */}
          <svg viewBox="0 0 100 100" className="w-full h-full sun-rotate-slow">
            <circle cx="50" cy="50" r="18" fill="#FFD700" />
            <g stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round">
              <line x1="50" y1="2" x2="50" y2="24" />
              <line x1="50" y1="76" x2="50" y2="98" />
              <line x1="2" y1="50" x2="24" y2="50" />
              <line x1="76" y1="50" x2="98" y2="50" />
              
              <line x1="16" y1="16" x2="31" y2="31" />
              <line x1="69" y1="69" x2="84" y2="84" />
              <line x1="16" y1="84" x2="31" y2="69" />
              <line x1="69" y1="31" x2="84" y2="16" />

              <line x1="32" y1="8" x2="40" y2="27" />
              <line x1="68" y1="92" x2="60" y2="73" />
              <line x1="8" y1="32" x2="27" y2="40" />
              <line x1="92" y1="68" x2="73" y2="60" />

              <line x1="68" y1="8" x2="60" y2="27" />
              <line x1="32" y1="92" x2="40" y2="73" />
              <line x1="92" y1="32" x2="73" y2="40" />
              <line x1="8" y1="68" x2="27" y2="60" />
            </g>
          </svg>
          <Crown className="absolute w-7 h-7 sm:w-8 sm:h-8 text-[#FFF099] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] -top-2" />
        </div>
      </div>

      {/* Main Bold Imperial Header */}
      <h1 className="font-cinzel font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-wider text-white uppercase mb-3 leading-tight">
        PETITION FOR <span className="gold-gradient-text">MACEDONIAN CITIZENSHIP</span>
      </h1>

      {/* Subtitle */}
      <p className="font-cinzel text-sm sm:text-xl text-[#FFF099] tracking-widest uppercase mb-6 max-w-3xl mx-auto border-b border-[#FFD700]/30 pb-4">
        Official Royal Trial & Sovereign Identification Registry
      </p>

      {/* Trust Feature Pills for Mobile & Desktop */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8 text-xs font-cinzel text-[#CBD5E1]">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#180a33]/80 border border-[#FFD700]/30">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>Verified Citizen ID</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#180a33]/80 border border-[#FFD700]/30">
          <FileText className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>A4 PDF Certificate</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#180a33]/80 border border-[#FFD700]/30">
          <CheckCircle className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>Unique National Code</span>
        </div>
      </div>

      {/* Welcome Message Card from the Sovereign King */}
      <div className="glass-card-gold p-5 sm:p-8 rounded-2xl max-w-2xl mx-auto mb-8 text-left relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Scroll className="w-32 h-32 text-[#FFD700]" />
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="gold-wax-seal !w-10 !h-10 flex-shrink-0">
            <Crown className="w-5 h-5 text-[#0a0514]" />
          </div>
          <div>
            <h3 className="font-cinzel font-bold text-base sm:text-lg gold-gradient-text leading-none">
              ROYAL CITIZENSHIP DECREE
            </h3>
            <span className="font-cinzel text-[11px] text-[#CBD5E1]/70">Issued by the Sovereign Court of Pella</span>
          </div>
        </div>

        <blockquote className="font-garamond italic text-base sm:text-xl text-[#F8F9FA] leading-relaxed mb-4 pl-3 sm:pl-4 border-l-2 border-[#FFD700]">
          "Greetings, traveler! Take the Royal Oath, complete the trial of allegiance, and receive your official imperial citizenship identification."
        </blockquote>

        <div className="flex items-center justify-between text-[11px] font-cinzel text-[#FFD700]/80 pt-2 border-t border-[#FFD700]/15">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" /> Sovereign Court</span>
          <span>Alexander III REX</span>
        </div>
      </div>

      {/* Apply CTA Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleCtaClick}
          className="btn-gold text-sm sm:text-lg py-3.5 px-8 sm:px-10 w-full sm:w-auto shadow-[0_0_30px_rgba(255,215,0,0.4)] group flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span>Apply for Citizenship Now</span>
          <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

    </section>
  );
}

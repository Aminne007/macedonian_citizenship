import React from 'react';
import { Crown, Sparkles, Scroll, ArrowDown, ShieldCheck } from 'lucide-react';
import { playImperialChime } from '../utils/audio';

export default function HeroSection({ onApplyClick }) {
  const handleCtaClick = () => {
    playImperialChime();
    onApplyClick();
  };

  return (
    <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto z-10">
      
      {/* Royal Crest Aura & Emblem */}
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 rounded-full bg-[#FFD700]/20 blur-2xl animate-pulse"></div>
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full bg-gradient-to-b from-[#3b0f7d] to-[#170733] border-2 border-[#FFD700] p-4 flex items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.4)]">
          {/* Animated Macedonian Sun */}
          <svg viewBox="0 0 100 100" className="w-full h-full sun-rotate-slow">
            <circle cx="50" cy="50" r="18" fill="#FFD700" />
            <g stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round">
              {/* 16 Rays */}
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
          <Crown className="absolute w-8 h-8 text-[#FFF099] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] -top-2" />
        </div>
      </div>

      {/* Main Bold Imperial Header */}
      <h1 className="font-cinzel font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-wider text-white uppercase mb-4 leading-tight">
        THE <span className="gold-gradient-text">MACEDONIAN EMPIRE</span>
      </h1>

      {/* Subtitle */}
      <p className="font-cinzel text-lg sm:text-2xl text-[#FFF099] tracking-widest uppercase mb-8 max-w-3xl mx-auto border-b border-[#FFD700]/30 pb-4">
        Official Citizen Registration & Loyalty Assessment
      </p>

      {/* Welcome Message Card from the Sovereign King */}
      <div className="glass-card-gold p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto mb-10 text-left relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Scroll className="w-32 h-32 text-[#FFD700]" />
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="gold-wax-seal !w-10 !h-10">
            <Crown className="w-5 h-5 text-[#0a0514]" />
          </div>
          <div>
            <h3 className="font-cinzel font-bold text-lg gold-gradient-text leading-none">
              PROCLAMATION FROM THE KING
            </h3>
            <span className="font-cinzel text-xs text-[#CBD5E1]/70">Issued by the Sovereign Court of Pella</span>
          </div>
        </div>

        <blockquote className="font-garamond italic text-lg sm:text-xl text-[#F8F9FA] leading-relaxed mb-4 pl-4 border-l-2 border-[#FFD700]">
          "Greetings, traveler of the realm! Before you may enter our grand court and claim the eternal protection of the Sovereign Sun, you must prove your worth, pass the Royal Trial, and swear solemn allegiance to Macedonia."
        </blockquote>

        <div className="flex items-center justify-between text-xs font-cinzel text-[#FFD700]/80 pt-2 border-t border-[#FFD700]/15">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#FFD700]" /> Royal Decree #8942</span>
          <span>Alexander III REX</span>
        </div>
      </div>

      {/* Apply CTA Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleCtaClick}
          className="btn-gold text-base sm:text-lg py-4 px-10 shadow-[0_0_30px_rgba(255,215,0,0.4)] group"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span>Apply for Citizenship</span>
          <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

    </section>
  );
}

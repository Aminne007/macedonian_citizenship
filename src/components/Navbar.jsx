import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Crown, Sparkles, UserCheck, BookOpen } from 'lucide-react';
import { toggleAudio } from '../utils/audio';

export default function Navbar({ onScrollToForm, onOpenLogin }) {
  const [audioOn, setAudioOn] = useState(true);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTimeString(`Year 334 BC / ${timeStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    const newState = toggleAudio(!audioOn);
    setAudioOn(newState);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090514]/80 border-b border-[#FFD700]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Empire Title */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#2A085C] border border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)] group-hover:scale-105 transition-transform">
            {/* Macedonian 16-ray Sun SVG */}
            <svg viewBox="0 0 100 100" className="w-7 h-7 sm:w-8 sm:h-8 sun-pulse-glow">
              <circle cx="50" cy="50" r="18" fill="#FFD700" />
              <g stroke="#FFD700" strokeWidth="3" strokeLinecap="round">
                <line x1="50" y1="5" x2="50" y2="25" />
                <line x1="50" y1="75" x2="50" y2="95" />
                <line x1="5" y1="50" x2="25" y2="50" />
                <line x1="75" y1="50" x2="95" y2="50" />
                
                <line x1="18" y1="18" x2="32" y2="32" />
                <line x1="68" y1="68" x2="82" y2="82" />
                <line x1="18" y1="82" x2="32" y2="68" />
                <line x1="68" y1="32" x2="82" y2="18" />

                <line x1="33" y1="10" x2="40" y2="28" />
                <line x1="67" y1="90" x2="60" y2="72" />
                <line x1="10" y1="33" x2="28" y2="40" />
                <line x1="90" y1="67" x2="72" y2="60" />

                <line x1="67" y1="10" x2="60" y2="28" />
                <line x1="33" y1="90" x2="40" y2="72" />
                <line x1="90" y1="33" x2="72" y2="40" />
                <line x1="10" y1="67" x2="28" y2="60" />
              </g>
            </svg>
          </div>
          <div>
            <span className="font-cinzel font-black tracking-widest text-base sm:text-xl gold-gradient-text block leading-none">
              MACEDONIA
            </span>
            <span className="font-cinzel text-[9px] sm:text-[10px] tracking-wider text-[#CBD5E1]/80 block uppercase mt-1">
              Imperial Sovereign Portal
            </span>
          </div>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#160b2c]/80 border border-[#FFD700]/20 text-xs font-mono text-[#FFD700]">
            <Crown className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>{timeString}</span>
          </div>

          {/* Empire History Link */}
          <Link
            to="/history"
            className="btn-outline-gold !py-2.5 !px-3 sm.px-4 !text-xs flex items-center gap-1.5"
            title="Explore Macedonian Empire History"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="hidden sm:inline">Empire History</span>
            <span className="sm:hidden">History</span>
          </Link>

          {/* Audio toggle button */}
          <button
            onClick={handleAudioToggle}
            className="p-2.5 rounded-full bg-[#1a0c30] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#2A085C] hover:border-[#FFD700] hover:scale-105 transition-all flex items-center gap-1.5"
            title={audioOn ? 'Mute Royal Audio' : 'Enable Royal Audio'}
          >
            {audioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          {/* Check Status / Login button */}
          <button
            type="button"
            onClick={onOpenLogin}
            className="btn-outline-gold !py-2.5 !px-3 sm.px-4 !text-xs flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="hidden md:inline">Citizen Login</span>
            <span className="md:hidden">Login</span>
          </button>

          {/* Quick Apply CTA */}
          {onScrollToForm && (
            <button
              type="button"
              onClick={onScrollToForm}
              className="btn-gold !py-2.5 !px-4 sm:!px-5 !text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Apply Now</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

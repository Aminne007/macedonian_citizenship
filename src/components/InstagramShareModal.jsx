import React, { useState } from 'react';
import { Instagram, Copy, Check, X, Download, Sparkles, ExternalLink } from 'lucide-react';
import { playImperialChime } from '../utils/audio';

export default function InstagramShareModal({ citizenData, citizenId, onClose, onDownloadCard }) {
  const [copied, setCopied] = useState(false);

  const captionText = `📜 I have officially passed the Royal Trial and earned my Citizenship in THE MACEDONIAN EMPIRE! ☀️\n\n👑 Title: ${citizenData.royalTitle}\n🆔 ID: ${citizenId}\n📱 Handle: ${citizenData.instagram}\n\nAll hail King Alexander III! #MacedonianEmpire #ImperialCitizenship #PellaArchives`;

  const handleCopyCaption = () => {
    playImperialChime();
    navigator.clipboard.writeText(captionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card-gold max-w-lg w-full p-6 sm:p-8 rounded-2xl relative shadow-[0_0_50px_rgba(255,215,0,0.3)] border-2 border-[#FFD700]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#120826] border border-[#FFD700]/30 text-[#CBD5E1] hover:text-white hover:border-[#FFD700]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg">
            <Instagram className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-cinzel font-bold text-xl gold-gradient-text leading-none">
              SHARE TO INSTAGRAM STORY
            </h3>
            <span className="font-cinzel text-xs text-[#CBD5E1]/80">Proclaim your citizenship to the digital realm</span>
          </div>
        </div>

        {/* Instructions Steps */}
        <div className="space-y-4 my-6">
          <div className="p-4 rounded-xl bg-[#100624]/90 border border-[#FFD700]/20 space-y-2">
            <span className="font-cinzel text-xs font-bold text-[#FFD700] uppercase tracking-wider block">
              1. Pre-written Story Caption:
            </span>
            <div className="p-3 rounded-lg bg-[#090414] font-mono text-xs text-[#CBD5E1] relative whitespace-pre-line border border-white/10">
              {captionText}
            </div>
            <button
              onClick={handleCopyCaption}
              className="btn-gold !py-2 !px-4 !text-xs w-full flex items-center justify-center gap-2 mt-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Caption Copied to Clipboard!' : 'Copy Instagram Caption'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#100624]/90 border border-[#FFD700]/20 space-y-2">
            <span className="font-cinzel text-xs font-bold text-[#FFD700] uppercase tracking-wider block">
              2. Download Citizenship ID Image:
            </span>
            <p className="text-xs text-[#CBD5E1]/80">
              Save your golden official ID card PNG to your phone or computer to post on your Story.
            </p>
            <button
              onClick={() => {
                onDownloadCard();
                onClose();
              }}
              className="btn-outline-gold !py-2.5 !px-4 !text-xs w-full flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#FFD700]" />
              Download ID Image for IG Story
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#FFD700]/20 text-xs font-cinzel text-[#CBD5E1]/70">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" /> Tag @MacedonianEmpire
          </span>
          <button
            onClick={onClose}
            className="text-[#FFD700] hover:underline font-bold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

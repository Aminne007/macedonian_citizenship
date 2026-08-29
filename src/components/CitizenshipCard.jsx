import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, Share2, Crown, Sparkles, RefreshCw, Check, Copy, Shield, Award, FileText, LogOut } from 'lucide-react';
import { playImperialChime } from '../utils/audio';

export default function CitizenshipCard({ citizenData, serverData, onReset }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const nationalCode = serverData?.national_code || '???';
  const issueDate = serverData?.approved_at
    ? new Date(serverData.approved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    const duration = 3500;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FFD700', '#FFF5C0', '#B8860B', '#9333EA'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FFD700', '#FFF5C0', '#B8860B', '#9333EA'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    playImperialChime();
    setDownloading(true);
    try {
      await new Promise(r => setTimeout(r, 120));
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2.5 });
      const link = document.createElement('a');
      link.download = `Macedonian_${nationalCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) { console.error('Download error', e); }
    finally { setDownloading(false); }
  };

  const handleDownloadPdf = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!cardRef.current) return;
    playImperialChime();
    setDownloading(true);
    try {
      await new Promise(r => setTimeout(r, 150));
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      pdf.addImage(dataUrl, 'PNG', 10, 15, 277, 180);
      pdf.save(`Macedonian_Citizenship_${nationalCode}.pdf`);
    } catch (err) {
      console.error('PDF Download error', err);
      alert('PDF generation error. Please try downloading as Image.');
    } finally {
      setDownloading(false);
    }
  };

  const captionText = `🏛️ IMPERIAL CITIZENSHIP GRANTED!\n\n👑 Citizen: ${citizenData.fullName}\n⭐ Title: ${citizenData.royalTitle}\n🆔 National Code: ${nationalCode}\n📱 ${citizenData.instagram}\n\n"I solemnly swear to uphold the glory of Macedonia across all digital lands." ☀️\n\n#MacedonianEmpire #ImperialCitizenship`;

  const handleCopyCaption = () => {
    playImperialChime();
    navigator.clipboard.writeText(captionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto relative z-10 animate-fade-in text-center">

      {/* Success Banner */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-900/50 border border-emerald-400 text-emerald-300 font-cinzel font-bold text-xs tracking-wider uppercase mb-5">
        <Sparkles className="w-4 h-4" />
        CITIZENSHIP APPROVED BY ROYAL DECREE
      </div>

      <h2 className="font-cinzel font-extrabold text-3xl sm:text-5xl gold-gradient-text mb-2 uppercase">
        WELCOME TO THE EMPIRE
      </h2>
      <p className="font-garamond italic text-lg text-[#CBD5E1]/80 max-w-lg mx-auto mb-8">
        Your loyalty has been eternally recorded in the Pella Archives. Present your card with honor.
      </p>

      {/* Official ID Card */}
      <div className="flex justify-center mb-8 px-2">
        <div ref={cardRef} className="imperial-card-wrap text-left flex flex-col justify-between relative select-none">
          <div className="card-pattern-overlay" />
          <div className="card-gold-border-inner" />

          {/* Watermark Sun */}
          <div className="absolute right-3 bottom-3 opacity-[0.07] pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-44 h-44">
              <circle cx="50" cy="50" r="18" fill="#FFD700" />
              <g stroke="#FFD700" strokeWidth="4">
                <line x1="50" y1="0" x2="50" y2="100" /><line x1="0" y1="50" x2="100" y2="50" />
                <line x1="15" y1="15" x2="85" y2="85" /><line x1="15" y1="85" x2="85" y2="15" />
              </g>
            </svg>
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#FFD700]/30 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="gold-wax-seal !w-10 !h-10 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-6 h-6">
                  <circle cx="50" cy="50" r="16" fill="#090514" />
                  <g stroke="#FFD700" strokeWidth="3">
                    <line x1="50" y1="10" x2="50" y2="90" /><line x1="10" y1="50" x2="90" y2="50" />
                    <line x1="22" y1="22" x2="78" y2="78" /><line x1="22" y1="78" x2="78" y2="22" />
                  </g>
                </svg>
              </div>
              <div>
                <h3 className="font-cinzel font-black text-sm text-white tracking-widest leading-tight">THE MACEDONIAN EMPIRE</h3>
                <span className="font-cinzel text-[10px] text-[#FFD700] uppercase tracking-wider">Official Citizen Identification</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs text-[#FFF099] font-bold block bg-[#2A085C]/90 px-2 py-0.5 rounded border border-[#FFD700]/40">{nationalCode}</span>
              <span className="font-cinzel text-[9px] text-[#CBD5E1]/60 block mt-0.5">ISSUED: {issueDate}</span>
            </div>
          </div>

          {/* Body */}
          <div className="relative z-10 my-4 grid grid-cols-2 gap-4 items-center">
            <div className="space-y-2.5">
              <div>
                <span className="font-cinzel text-[10px] text-[#FFD700] uppercase block tracking-wider">CITIZEN NAME</span>
                <h4 className="font-cinzel font-bold text-lg text-white truncate gold-gradient-text-bright">{citizenData.fullName}</h4>
              </div>
              <div>
                <span className="font-cinzel text-[10px] text-[#CBD5E1]/80 uppercase block tracking-wider">INSTAGRAM</span>
                <span className="font-inter font-semibold text-sm text-[#FFD700]">{citizenData.instagram}</span>
              </div>
              <div>
                <span className="font-cinzel text-[10px] text-[#CBD5E1]/80 uppercase block tracking-wider">IMPERIAL TITLE</span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2A085C] border border-[#FFD700]/50 text-[11px] font-cinzel font-bold text-[#FFF099]">
                  <Award className="w-3 h-3 text-[#FFD700]" />{citizenData.royalTitle}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-center gap-2">
              <div className="p-3 rounded-xl bg-[#090514]/80 border border-[#FFD700]/30 text-center w-36">
                <Shield className="w-5 h-5 text-[#FFD700] mx-auto mb-1" />
                <span className="font-cinzel text-[9px] font-bold text-[#FFD700] uppercase block tracking-wider">STATUS: VERIFIED</span>
                <span className="font-cinzel text-[8px] text-[#CBD5E1]/60 uppercase">FULL COURT PRIVILEGES</span>
              </div>
              <div className="w-36 bg-white/90 p-1 rounded flex items-center justify-between">
                <div className="h-5 flex items-center gap-[2px] w-full justify-center">
                  {[4,2,6,1,3,5,2,4,1,3,6,2,4,2,5,1,3,4,2].map((w, i) => (
                    <span key={i} className="bg-black inline-block h-full" style={{ width: `${w}px` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 pt-2 border-t border-[#FFD700]/20 flex items-center justify-between text-[9px] font-cinzel text-[#CBD5E1]/70">
            <span>SOVEREIGN DECREE OF PELLA</span>
            <span className="flex items-center gap-1 text-[#FFD700]"><Crown className="w-3 h-3" /> MACEDONIA 2026</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={handleDownload} disabled={downloading} className="btn-gold !py-3 !px-5 !text-sm">
          <Download className="w-4 h-4" />
          {downloading ? 'Generating...' : 'Download Image'}
        </button>
        <button type="button" onClick={handleDownloadPdf} disabled={downloading} className="btn-gold !py-3 !px-5 !text-sm !bg-gradient-to-r !from-[#B8860B] !to-[#FFD700] !text-[#090514]">
          <FileText className="w-4 h-4" />
          {downloading ? 'Generating PDF...' : 'Download PDF Certificate'}
        </button>
        <button type="button" onClick={() => setShowShareModal(true)} className="btn-outline-gold !py-3 !px-5 !text-sm">
          <Share2 className="w-4 h-4 text-[#FFD700]" />
          Share to Instagram
        </button>
        <button
          type="button"
          onClick={() => { playImperialChime(); onReset(); }}
          className="btn-outline-gold !py-3 !px-5 !text-sm flex items-center gap-1.5 border-red-500/40 text-red-300 hover:bg-red-900/40"
          title="Log Out of Citizen Session"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          Log Out
        </button>
      </div>

      {/* Instagram Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card-gold max-w-md w-full p-6 sm:p-8 rounded-2xl relative border-2 border-[#FFD700]">
            <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-[#120826] border border-[#FFD700]/30 text-[#CBD5E1] hover:text-white">✕</button>
            <h3 className="font-cinzel font-bold text-xl gold-gradient-text mb-1">Share to Instagram Story</h3>
            <p className="font-cinzel text-xs text-[#CBD5E1]/70 mb-4">Proclaim your citizenship to the digital realm</p>

            <div className="bg-[#090414] rounded-lg p-3 font-mono text-xs text-[#CBD5E1] whitespace-pre-line border border-white/10 mb-3 text-left">{captionText}</div>
            <button onClick={handleCopyCaption} className="btn-gold !py-2.5 !px-4 !text-xs w-full mb-4">
              {copied ? <><Check className="w-4 h-4 text-emerald-950" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Caption</>}
            </button>

            <p className="text-xs text-[#CBD5E1]/50 font-inter mb-3">Then download your ID card image to post on your story:</p>
            <button onClick={() => { handleDownload(); setShowShareModal(false); }} className="btn-outline-gold !py-2.5 !px-4 !text-xs w-full">
              <Download className="w-4 h-4 text-[#FFD700]" /> Download ID Image
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Sparkles, BookOpen, ShieldCheck, ArrowLeft, Scroll, Award, ChevronRight } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

export default function EmpireHistory() {
  const [activeTab, setActiveTab] = useState('rise');

  const timelineEvents = [
    {
      year: '359 BC',
      title: 'Ascension of Philip II',
      desc: 'King Philip II reorganizes the Macedonian army, introducing the legendary 18-foot Sarissa spear and invincible Phalanx formation, forging a supreme military superpower.'
    },
    {
      year: '338 BC',
      title: 'Battle of Chaeronea',
      desc: 'Philip II defeats the allied Greek city-states, unifying Greece under the League of Corinth and establishing Macedonian hegemony over the Aegean.'
    },
    {
      year: '336 BC',
      title: 'Ascension of Alexander III (The Great)',
      desc: 'At age 20, Alexander III inherits the throne of Macedon following Philip’s assassination, tutored by Aristotle and driven to conquer the known world.'
    },
    {
      year: '333 BC',
      title: 'Battle of Issus & Persian Campaign',
      desc: 'Alexander decisively defeats King Darius III of Persia at Issus, liberating Asia Minor and expanding the Macedonian frontier across Phoenicia and Egypt.'
    },
    {
      year: '331 BC',
      title: 'Founding of Alexandria & Gaugamela',
      desc: 'Alexander founds the city of Alexandria in Egypt and destroys the main Persian host at Gaugamela, claiming the title of King of Persia and King of Asia.'
    },
    {
      year: '326 BC',
      title: 'Indian Expedition & Hydaspes',
      desc: 'Macedonian armies cross the Indus River, defeating King Porus at the Battle of the Hydaspes River, stretching the Empire from Europe to India.'
    },
    {
      year: '323 BC',
      title: 'The Eternal Legacy',
      desc: 'Alexander passes away in Babylon at age 32, leaving behind an empire spanning three continents and ushering in the Hellenistic Era of science and culture.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#090514] text-[#F8F9FA] relative flex flex-col overflow-x-hidden">
      <ParticleBackground />

      {/* Header Bar */}
      <header className="relative z-20 border-b border-[#FFD700]/20 bg-[#06030c]/90 px-4 sm:px-8 py-4 backdrop-blur-md flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-[#2A085C] border border-[#FFD700]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-4 h-4 text-[#FFD700]" />
          </div>
          <span className="font-cinzel font-bold text-xs sm:text-sm text-[#FFD700] uppercase tracking-wider">
            Back to Application Portal
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-[#FFD700]" />
          <span className="font-cinzel font-extrabold text-sm gold-gradient-text hidden sm:inline uppercase">
            Imperial History Archives
          </span>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative pt-12 pb-16 px-4 sm:px-8 max-w-5xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c0c38] border border-[#FFD700]/40 text-[#FFD700] text-xs font-cinzel font-bold tracking-widest uppercase mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Chronicles of the Sovereign Sun</span>
        </div>
        <h1 className="font-cinzel font-black text-3xl sm:text-6xl text-white uppercase tracking-wider mb-4 leading-tight">
          THE MACEDONIAN <span className="gold-gradient-text">EMPIRE</span>
        </h1>
        <p className="font-garamond italic text-lg sm:text-2xl text-[#FFF099] max-w-3xl mx-auto leading-relaxed">
          From the regal palaces of Pella to the farthest reaches of the Indus Valley, discover the glory, strategy, and sovereign heritage of ancient Macedon.
        </p>
      </section>

      {/* Main Content Tabs */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pb-20 w-full flex-1">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {[
            { id: 'rise', label: 'I. Unification & Rise', icon: '🏛️' },
            { id: 'conquest', label: 'II. World Conquest', icon: '⚔️' },
            { id: 'sun', label: 'III. The Sovereign Sun', icon: '☀️' },
            { id: 'timeline', label: 'IV. Interactive Timeline', icon: '📜' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-cinzel text-xs sm:text-sm font-bold uppercase py-2.5 px-4 sm:px-6 rounded-full border transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-[#090514] border-[#FFF099] shadow-[0_0_20px_rgba(255,215,0,0.4)]'
                  : 'bg-[#150a2d]/80 text-[#CBD5E1] border-[#FFD700]/30 hover:border-[#FFD700]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Unification & Rise */}
        {activeTab === 'rise' && (
          <div className="animate-fade-in space-y-8">
            <div className="glass-card-gold p-6 sm:p-10 rounded-2xl grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-[#FFD700]" />
                  <h2 className="font-cinzel font-bold text-xl sm:text-2xl gold-gradient-text">
                    The Capital of Pella & Military Genius
                  </h2>
                </div>
                <p className="font-garamond text-base sm:text-lg text-[#F8F9FA]/90 leading-relaxed mb-4">
                  Under King Philip II (359–336 BC), the Kingdom of Macedonia was transformed from a fractured northern realm into the most formidable military engine of antiquity.
                </p>
                <p className="font-inter text-xs sm:text-sm text-[#CBD5E1]/80 leading-relaxed">
                  Philip developed the <strong>Macedonian Phalanx</strong>, equipping foot soldiers with the 18-foot <em>Sarissa</em> pike. Combined with heavy <em>Companion Cavalry</em>, Macedonia created an invincible combined-arms warfare system.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden border border-[#FFD700]/40 shadow-2xl">
                <img
                  src="/images/pella_palace.png"
                  alt="Ancient Macedonian Palace at Pella"
                  className="w-full h-64 sm:h-80 object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="bg-[#090514] p-3 text-center border-t border-[#FFD700]/20">
                  <span className="font-cinzel text-[11px] text-[#FFD700] uppercase tracking-wider">
                    🏛️ The Imperial Royal Palace at Pella
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-cinzel font-bold text-lg text-white mb-2 flex items-center gap-2">
                  <Scroll className="w-5 h-5 text-[#FFD700]" /> Intellectual Golden Age
                </h3>
                <p className="font-inter text-xs sm:text-sm text-[#CBD5E1]/80 leading-relaxed">
                  Pella became the cultural center of the ancient world. Philip II appointed the great philosopher <strong>Aristotle</strong> to tutor young Prince Alexander, instilling a deep passion for science, medicine, poetry, and leadership.
                </p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-cinzel font-bold text-lg text-white mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FFD700]" /> Unification of Hellas
                </h3>
                <p className="font-inter text-xs sm:text-sm text-[#CBD5E1]/80 leading-relaxed">
                  After victory at Chaeronea in 338 BC, Philip formed the <em>League of Corinth</em>, uniting the Greek states into a single powerful alliance poised to challenge the Persian Empire.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: World Conquest */}
        {activeTab === 'conquest' && (
          <div className="animate-fade-in space-y-8">
            <div className="glass-card-gold p-6 sm:p-10 rounded-2xl grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 rounded-xl overflow-hidden border border-[#FFD700]/40 shadow-2xl">
                <img
                  src="/images/alexander_conquest.png"
                  alt="Alexander the Great Leading Macedonian Army"
                  className="w-full h-64 sm:h-80 object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="bg-[#090514] p-3 text-center border-t border-[#FFD700]/20">
                  <span className="font-cinzel text-[11px] text-[#FFD700] uppercase tracking-wider">
                    ⚔️ Alexander the Great Leading the Charge
                  </span>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-[#FFD700]" />
                  <h2 className="font-cinzel font-bold text-xl sm:text-2xl gold-gradient-text">
                    Alexander III & The Great Campaign
                  </h2>
                </div>
                <p className="font-garamond text-base sm:text-lg text-[#F8F9FA]/90 leading-relaxed mb-4">
                  In 334 BC, at just 22 years of age, Alexander crossed the Hellespont into Asia with 42,000 soldiers. In 12 years of undefeated campaigns, he carved out the largest empire in history.
                </p>
                <p className="font-inter text-xs sm:text-sm text-[#CBD5E1]/80 leading-relaxed">
                  From Granicus to Issus, Gaugamela to the banks of the Hydaspes in India, Alexander remains history's greatest military commander, never once suffering a defeat in battle.
                </p>
              </div>
            </div>

            {/* Campaign Key Battles */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="glass-card p-5 rounded-xl text-center">
                <span className="font-cinzel text-xs text-[#FFD700] uppercase block mb-1">333 BC</span>
                <h4 className="font-cinzel font-bold text-base text-white mb-2">Battle of Issus</h4>
                <p className="font-inter text-xs text-[#CBD5E1]/70">
                  Alexander broke the Persian center, routing Darius III and securing the Levant.
                </p>
              </div>
              <div className="glass-card p-5 rounded-xl text-center">
                <span className="font-cinzel text-xs text-[#FFD700] uppercase block mb-1">331 BC</span>
                <h4 className="font-cinzel font-bold text-base text-white mb-2">Battle of Gaugamela</h4>
                <p className="font-inter text-xs text-[#CBD5E1]/70">
                  Masterpiece tactics destroyed 200,000 Persian troops, making Alexander King of Asia.
                </p>
              </div>
              <div className="glass-card p-5 rounded-xl text-center">
                <span className="font-cinzel text-xs text-[#FFD700] uppercase block mb-1">326 BC</span>
                <h4 className="font-cinzel font-bold text-base text-white mb-2">Hydaspes River</h4>
                <p className="font-inter text-xs text-[#CBD5E1]/70">
                  Defeated King Porus’s war elephants, extending Macedonian rule into India.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: The Sovereign Sun */}
        {activeTab === 'sun' && (
          <div className="animate-fade-in space-y-8">
            <div className="glass-card-gold p-6 sm:p-10 rounded-2xl grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-[#FFD700]" />
                  <h2 className="font-cinzel font-bold text-xl sm:text-2xl gold-gradient-text">
                    The Sacred 16-Ray Sun of Macedonia
                  </h2>
                </div>
                <p className="font-garamond text-base sm:text-lg text-[#F8F9FA]/90 leading-relaxed mb-4">
                  The <strong>Vergina Sun</strong> (Macedonian Sun) is the supreme royal emblem of the Argead Dynasty, representing divine light, unity, and imperial sovereignty.
                </p>
                <p className="font-inter text-xs sm:text-sm text-[#CBD5E1]/80 leading-relaxed mb-3">
                  Discovered on the golden larnax of King Philip II at Vergina, the 16 rays symbolize the four elements (Earth, Water, Fire, Air) and the 12 Olympic deities protecting the Empire.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden border border-[#FFD700]/40 shadow-2xl">
                <img
                  src="/images/vergina_sun.png"
                  alt="Golden 16-Ray Vergina Sun Symbol"
                  className="w-full h-64 sm:h-80 object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="bg-[#090514] p-3 text-center border-t border-[#FFD700]/20">
                  <span className="font-cinzel text-[11px] text-[#FFD700] uppercase tracking-wider">
                    ☀️ The Argead Royal Golden Sun Emblem
                  </span>
                </div>
              </div>
            </div>

            {/* Symbolism Grid */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-cinzel font-bold text-base text-[#FFD700] mb-2">16 Rays of Power</h3>
                <p className="font-inter text-xs text-[#CBD5E1]/80 leading-relaxed">
                  Four primary rays represent the cardinal directions and elements; twelve secondary rays represent cosmic order and divinity.
                </p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-cinzel font-bold text-base text-[#FFD700] mb-2">Royal Armor & Seals</h3>
                <p className="font-inter text-xs text-[#CBD5E1]/80 leading-relaxed">
                  Emblazoned upon Alexander’s golden breastplate, coins, shield bosses, and official imperial citizen certificates.
                </p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-cinzel font-bold text-base text-[#FFD700] mb-2">Eternal Continuity</h3>
                <p className="font-inter text-xs text-[#CBD5E1]/80 leading-relaxed">
                  Serves as the proud symbol of Macedonian heritage, resilience, and honor across over two millennia of history.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Interactive Timeline */}
        {activeTab === 'timeline' && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-cinzel font-bold text-2xl gold-gradient-text mb-2">
                IMPERIAL MILESTONE TIMELINE
              </h2>
              <p className="font-garamond italic text-base text-[#CBD5E1]/70">
                Key events that built the grandest empire in ancient history.
              </p>
            </div>

            <div className="relative border-l-2 border-[#FFD700]/40 pl-6 sm:pl-8 ml-2 sm:ml-4 space-y-8">
              {timelineEvents.map((item, i) => (
                <div key={i} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[#FFD700] border-4 border-[#090514] group-hover:scale-125 transition-transform shadow-[0_0_12px_#FFD700]" />
                  
                  <div className="glass-card p-5 sm:p-6 rounded-xl">
                    <span className="font-cinzel font-bold text-xs sm:text-sm text-[#FFD700] tracking-widest uppercase block mb-1">
                      {item.year}
                    </span>
                    <h3 className="font-cinzel font-bold text-lg sm:text-xl text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="font-inter text-xs sm:text-sm text-[#CBD5E1]/80 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Join Empire CTA Card */}
        <div className="mt-16 glass-card-gold p-8 rounded-2xl text-center relative overflow-hidden">
          <Crown className="w-12 h-12 text-[#FFD700] mx-auto mb-3" />
          <h2 className="font-cinzel font-extrabold text-2xl sm:text-4xl text-white uppercase mb-3">
            BECOME A REGISTERED IMPERIAL CITIZEN
          </h2>
          <p className="font-garamond italic text-base sm:text-xl text-[#FFF099] max-w-xl mx-auto mb-6">
            Take your place in history. Pass the Royal Trial, swear the oath, and receive your official Citizen Identification Card.
          </p>
          <Link
            to="/"
            className="btn-gold !py-3.5 !px-8 !text-base shadow-[0_0_30px_rgba(255,215,0,0.4)] inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Apply For Citizenship Now</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#FFD700]/20 bg-[#06030c]/90 py-6 px-4 text-center backdrop-blur-md">
        <div className="font-cinzel text-xs text-[#CBD5E1]/50">
          © 334 BC – 2026 AD Imperial Sovereign Court of Pella. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

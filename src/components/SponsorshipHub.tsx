import React, { useState } from 'react';
import { LanguageCode } from '../types';
import { Heart, Sparkles, Shield, CheckCircle2, Globe, Users, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface SponsorshipHubProps {
  language: LanguageCode;
  onBack: () => void;
}

export const SponsorshipHub: React.FC<SponsorshipHubProps> = ({ language, onBack }) => {
  const [selectedTier, setSelectedTier] = useState<number>(5000);
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const tiers = [
    {
      amount: 5000,
      children: 1,
      title: 'Seed Sponsor (1 Child)',
      desc: 'Provides full 3-month access to Levels 2-5 for one underprivileged young African AI learner.',
    },
    {
      amount: 25000,
      children: 5,
      title: 'Community Sponsor (5 Children)',
      desc: 'Equips a mini-cohort of 5 children with computer vision, NLP, and QA dataset training.',
    },
    {
      amount: 50000,
      children: 10,
      title: 'Classroom Sponsor (10 Children)',
      desc: 'Sponsors an entire classroom cohort across public or rural schools in Nigeria and West Africa.',
    },
    {
      amount: 100000,
      children: 20,
      title: 'Ecosystem Partner (20 Children)',
      desc: 'Provides 20 sponsored student licenses, quarterly anonymized AI literacy reports, and recognition.',
    },
  ];

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorEmail.trim()) return;

    sounds.playFanfare();
    setIsSuccess(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#EC4899', '#10B981', '#F59E0B'],
      });
    } catch {}
  };

  return (
    <div id="sponsorship-hub" className="flex flex-col gap-6 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 animate-fade-in text-white">
      {/* Hero Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-rose-950/60 via-neutral-900 to-neutral-900 border border-rose-800/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-lg">
            <Heart className="w-8 h-8 fill-rose-500/30" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                MLQuest Africa Philanthropy
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              Sponsor an African Child&apos;s AI Journey
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl">
              100% of sponsorship funds go directly to subsidizing full platform access (₦5,000 / 3 Months) for children across public schools and underserved communities.
            </p>
          </div>
        </div>
      </div>

      {isSuccess ? (
        <div className="p-8 rounded-3xl bg-neutral-900 border border-emerald-500/50 flex flex-col items-center text-center gap-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">Thank You for Empowering African Youth!</h3>
          <p className="text-xs text-neutral-300 max-w-md">
            Your sponsorship has been registered. We have allocated licenses to our partner schools and will deliver anonymized impact metrics directly to <strong>{sponsorEmail}</strong>.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
          >
            Back to Quests
          </button>
        </div>
      ) : (
        <form onSubmit={handleSponsorSubmit} className="flex flex-col gap-6">
          {/* Tier Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((t) => {
              const isSelected = selectedTier === t.amount;
              return (
                <button
                  key={t.amount}
                  type="button"
                  onClick={() => {
                    setSelectedTier(t.amount);
                    sounds.playClick();
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/30 text-white shadow-lg'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                      {t.children} {t.children === 1 ? 'Child' : 'Children'}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{t.title}</h4>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-tight">{t.desc}</p>
                  </div>

                  <div className="text-lg font-black font-mono text-white mt-2">
                    ₦{t.amount.toLocaleString()}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sponsor Contact Details */}
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-lg flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Sponsor Details & Privacy Guarantee
            </h3>
            <p className="text-xs text-neutral-400">
              In accordance with child protection standards, sponsors receive aggregate impact reports without accessing any personal child data or identifiable information.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
                  Your Name or Organization (Optional)
                </label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="e.g. Lagos Tech Collective, Dr. Kemi"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
                  Email for Impact Reports & Receipt
                </label>
                <input
                  type="email"
                  required
                  value={sponsorEmail}
                  onChange={(e) => setSponsorEmail(e.target.value)}
                  placeholder="e.g. contact@sponsor.org"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 py-3.5 px-8 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Confirm Sponsorship (₦{selectedTier.toLocaleString()})</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

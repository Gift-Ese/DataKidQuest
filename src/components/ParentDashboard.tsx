import React, { useState } from 'react';
import { ChildProfile, LanguageCode } from '../types';
import { 
  Shield, 
  TrendingUp, 
  Award, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Layers, 
  Image as ImageIcon, 
  MessageSquare, 
  Volume2, 
  Film, 
  Bot, 
  Lock,
  Download
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { ALL_BADGES } from '../data/badges';

interface ParentDashboardProps {
  profile: ChildProfile;
  language: LanguageCode;
  onUpdateProfile: (updated: ChildProfile) => void;
  onOpenUpgradeModal: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  language,
  onUpdateProfile,
  onOpenUpgradeModal,
}) => {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'SUBSCRIPTION' | 'SAFETY'>('ANALYTICS');

  const stats = profile.accuracy_stats;

  const calculateRate = (attempts: number, successes: number) => {
    if (attempts === 0) return 85; // Baseline demo display
    return Math.round((successes / attempts) * 100);
  };

  const modalities = [
    {
      name: 'Image Computer Vision',
      sub: 'Bounding Box Overlap (IoU)',
      rate: calculateRate(stats.image.attempts, stats.image.successes),
      attempts: Math.max(1, stats.image.attempts),
      icon: ImageIcon,
      color: 'emerald',
    },
    {
      name: 'African Dialect NLP',
      sub: 'Sentiment & Intent Classification',
      rate: calculateRate(stats.text.attempts, stats.text.successes),
      attempts: Math.max(1, stats.text.attempts),
      icon: MessageSquare,
      color: 'blue',
    },
    {
      name: 'Acoustic Audio Spectrograms',
      sub: 'Environmental Sound Event Detection',
      rate: calculateRate(stats.audio.attempts, stats.audio.successes),
      attempts: Math.max(1, stats.audio.attempts),
      icon: Volume2,
      color: 'amber',
    },
    {
      name: 'Video Temporal Tracking',
      sub: 'Multi-frame Trajectory Consistency',
      rate: calculateRate(stats.video.attempts, stats.video.successes),
      attempts: Math.max(1, stats.video.attempts),
      icon: Film,
      color: 'purple',
    },
    {
      name: 'AI QA & Error Inspection',
      sub: 'Hallucination & Bias Detection',
      rate: calculateRate(stats.qa.attempts, stats.qa.successes),
      attempts: Math.max(1, stats.qa.attempts),
      icon: Bot,
      color: 'rose',
    },
  ];

  return (
    <div id="parent-dashboard-container" className="flex flex-col gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 animate-fade-in text-white">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-neutral-900 to-neutral-900 border border-blue-800/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-lg">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Parent & Educator Portal
              </span>
              <span className="text-xs text-neutral-400">Learner: <strong>{profile.nickname}</strong></span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              AI Literacy & Skill Development Hub
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl">
              Track your child’s critical thinking, precision annotation calibration, and ethical AI evaluation progress.
            </p>
          </div>
        </div>

        {/* Certificate Export Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playSuccessChime();
            alert(`Generating Official MLQuest Africa AI Literacy Certificate for ${profile.nickname}...`);
          }}
          className="py-3 px-5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-2 transition-all shrink-0 shadow"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Progress Certificate</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        {[
          { id: 'ANALYTICS', label: '📊 Skill Analytics & Progress' },
          { id: 'SUBSCRIPTION', label: '💳 Subscription & Plan' },
          { id: 'SAFETY', label: '🛡️ Safety & Privacy Controls' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id as any);
              sounds.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === 'ANALYTICS' && (
        <div className="flex flex-col gap-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow">
              <span className="text-xs text-neutral-400">Total Quests Completed</span>
              <div className="text-2xl font-black text-white mt-1">{profile.completed_quests.length}</div>
              <span className="text-[11px] text-emerald-400 font-medium mt-1 block">Level {profile.level} Milestone Reached</span>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow">
              <span className="text-xs text-neutral-400">AI Experience Points (XP)</span>
              <div className="text-2xl font-black text-amber-400 mt-1">{profile.xp} XP</div>
              <span className="text-[11px] text-neutral-400 mt-1 block">Daily Streak: {profile.streak_days} days 🔥</span>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow">
              <span className="text-xs text-neutral-400">Overall Accuracy Rate</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">88.5%</div>
              <span className="text-[11px] text-emerald-300 mt-1 block">↑ 14% improvement over baseline</span>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow">
              <span className="text-xs text-neutral-400">AI Badges Earned</span>
              <div className="text-2xl font-black text-purple-400 mt-1">{profile.badges.length} of {ALL_BADGES.length}</div>
              <span className="text-[11px] text-purple-300 mt-1 block">Next: Vision Master Badge</span>
            </div>
          </div>

          {/* Detailed Skill Breakdown across Modalities */}
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-lg flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Machine Learning Skill Competency Index
            </h3>
            <p className="text-xs text-neutral-400">
              Evaluated across spatial geometry, linguistic nuance, acoustic recognition, and critical QA oversight.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              {modalities.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.name} className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-neutral-900 text-neutral-300">
                          <Icon className="w-4 h-4 text-emerald-400" />
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{m.name}</h4>
                          <span className="text-[10px] text-neutral-400">{m.sub}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black font-mono text-emerald-400">{m.rate}%</span>
                        <span className="text-[10px] text-neutral-500 block">Mastery Score</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-neutral-850 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${m.rate}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Showcase */}
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-lg flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Earned AI Achievement Badges
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ALL_BADGES.map((b) => {
                const isEarned = profile.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center text-center gap-1.5 ${
                      isEarned
                        ? 'bg-neutral-950 border-amber-500/40 text-neutral-100 shadow'
                        : 'bg-neutral-950/40 border-neutral-850 text-neutral-500 opacity-50'
                    }`}
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <span className="text-xs font-bold">{b.title}</span>
                    <span className="text-[10px] text-neutral-400 leading-tight">{b.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'SUBSCRIPTION' && (
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-lg flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-black text-white">DataKidQuest Subscription Plan</h3>
              <p className="text-xs text-neutral-400">
                Transparent, child-first learning model powered by MLQuest Africa.
              </p>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              profile.is_premium_unlocked
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-neutral-800 text-neutral-300'
            }`}>
              {profile.is_premium_unlocked ? '✨ Active Full Access' : '🌱 Free Tier (Level 1)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Plan */}
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Level 1: Data Explorer</h4>
                <div className="text-xl font-black text-emerald-400 mt-1">Free Forever</div>
                <p className="text-xs text-neutral-400 mt-2">
                  Full access to 40+ foundational quests, basic image bounding boxes, text sentiment, and the first AI Boss Quest.
                </p>
              </div>
              <span className="text-xs text-neutral-400">Included with all learner accounts.</span>
            </div>

            {/* Premium Plan */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-neutral-950 to-neutral-950 border border-emerald-500/50 flex flex-col justify-between gap-4 shadow-lg">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">All Levels (1 to 5) Full Access</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <div className="text-2xl font-black text-white mt-1">₦5,000 <span className="text-xs text-neutral-400 font-normal">/ 3 Months</span></div>
                <p className="text-xs text-neutral-300 mt-2">
                  Unlocks Levels 2-5: Multi-object precision bounding boxes, QA Inspector mode, &quot;Catch the AI&quot; game, dataset governance, and official certificates.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onOpenUpgradeModal();
                  sounds.playClick();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                {profile.is_premium_unlocked ? 'Extend / Manage Subscription' : 'Upgrade Learner (₦5,000)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Tab */}
      {activeTab === 'SAFETY' && (
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-lg flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-black text-white">Child Safety & Ethical AI Architecture</h3>
            <p className="text-xs text-neutral-400">
              MLQuest Africa adheres to strict child data privacy standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">No Public Chat or Unmoderated Contact</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Children only interact with structured annotation tools and the child-safe QuestBot assistant.
                </p>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Zero Behavioral Tracking or 3rd Party Ads</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  No personal data is collected or sold. We only store learner pseudonyms (e.g. &quot;TundeAI&quot;) and annotation coordinates.
                </p>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Server-Side Sandboxed AI Engine</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  All AI models run server-side with strict safety filtering and pedagogical guardrails.
                </p>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Authentic African Dataset Exposure</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Training datasets reflect local cultural nuances, indigenous languages, and regional transportation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

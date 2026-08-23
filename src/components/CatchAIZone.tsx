import React from 'react';
import { Quest, ChildProfile, LanguageCode } from '../types';
import { Bot, Sparkles, AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface CatchAIZoneProps {
  quests: Quest[];
  profile: ChildProfile;
  language: LanguageCode;
  onSelectQuest: (quest: Quest) => void;
  onOpenUpgradeModal: () => void;
}

export const CatchAIZone: React.FC<CatchAIZoneProps> = ({
  quests,
  profile,
  language,
  onSelectQuest,
  onOpenUpgradeModal,
}) => {
  const qaQuests = quests.filter(q => q.annotation_type === 'QA_INSPECTION');

  return (
    <div id="catch-ai-zone" className="flex flex-col gap-6 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 animate-fade-in text-white">
      {/* Zone Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-neutral-900 to-neutral-900 border border-purple-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-lg">
            <Bot className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Signature Game Mode
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              &quot;Can You Catch AI?&quot; QA Inspector Zone
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl">
              AI models make mistakes all the time! Inspect the AI&apos;s predictions, catch its bounding box blunders, detect sarcasm confusion, and save datasets from errors.
            </p>
          </div>
        </div>
      </div>

      {/* QA Inspection Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {qaQuests.map((quest) => {
          const isCompleted = profile.completed_quests.includes(quest.id);
          const isLocked = quest.level > 1 && !profile.is_premium_unlocked;

          return (
            <div
              key={quest.id}
              onClick={() => {
                if (isLocked) {
                  onOpenUpgradeModal();
                } else {
                  onSelectQuest(quest);
                }
                sounds.playClick();
              }}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 cursor-pointer relative overflow-hidden ${
                isCompleted
                  ? 'bg-neutral-900/60 border-purple-500/30'
                  : isLocked
                  ? 'bg-neutral-950/60 border-neutral-850 opacity-80'
                  : 'bg-neutral-900 border-neutral-800 hover:border-purple-500/60 hover:bg-neutral-850 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" /> Level {quest.level} QA Mission
                </span>
                {isCompleted && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Caught!
                  </span>
                )}
                {isLocked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{quest.title}</h4>
                <p className="text-xs text-neutral-300 mt-1 line-clamp-2">{quest.instruction}</p>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <span className="font-bold text-purple-400">+{quest.xp_reward} XP</span>
                <span className="text-purple-400 font-bold flex items-center gap-1">
                  Inspect AI <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

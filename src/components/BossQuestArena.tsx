import React from 'react';
import { Quest, ChildProfile, LanguageCode } from '../types';
import { LEVEL_INFOS } from '../data/levelInfo';
import { Crown, Sparkles, Trophy, Lock, Play, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface BossQuestArenaProps {
  quests: Quest[];
  profile: ChildProfile;
  language: LanguageCode;
  onSelectQuest: (quest: Quest) => void;
  onOpenUpgradeModal: () => void;
  onBack: () => void;
}

export const BossQuestArena: React.FC<BossQuestArenaProps> = ({
  quests,
  profile,
  language,
  onSelectQuest,
  onOpenUpgradeModal,
  onBack,
}) => {
  const bossQuests = quests.filter(q => q.is_boss_quest);

  return (
    <div id="boss-quest-arena" className="flex flex-col gap-6 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 animate-fade-in text-white">
      {/* Arena Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-950/70 via-neutral-900 to-neutral-900 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <Crown className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                End-of-Level Mastery Arenas
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              AI Boss Quest Arena
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-xl">
              Complete each level’s Boss Quest to prove your mastery, calibrate AI ground truths, and unlock official AI badges!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Quests
        </button>
      </div>

      {/* Boss Quests List */}
      <div className="grid grid-cols-1 gap-4">
        {LEVEL_INFOS.map((lvl) => {
          const matchedQuest = bossQuests.find(q => q.level === lvl.level);
          const isCompleted = matchedQuest ? profile.completed_quests.includes(matchedQuest.id) : false;
          const isLocked = !lvl.isFree && !profile.is_premium_unlocked;

          return (
            <div
              key={lvl.level}
              className={`p-6 rounded-3xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden ${
                isCompleted
                  ? 'bg-neutral-900/80 border-emerald-500/40 shadow-lg'
                  : isLocked
                  ? 'bg-neutral-950/60 border-neutral-850 opacity-80'
                  : 'bg-neutral-900 border-amber-500/30 hover:border-amber-500 shadow-xl'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-xl font-bold shadow-md ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isLocked
                    ? 'bg-neutral-800 text-neutral-500'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-7 h-7" /> : isLocked ? <Lock className="w-6 h-6 text-amber-400" /> : <Crown className="w-7 h-7" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                      Level {lvl.level} Boss Quest
                    </span>
                    {lvl.isFree && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        FREE LEVEL 1
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {matchedQuest ? matchedQuest.title : lvl.bossQuestTitle}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 max-w-xl leading-relaxed">
                    {matchedQuest ? matchedQuest.instruction : lvl.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                    <span className="font-bold text-emerald-400">+{matchedQuest?.xp_reward || 150} XP</span>
                    <span>•</span>
                    <span>Badge: {lvl.badgeId}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isLocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenUpgradeModal();
                      sounds.playClick();
                    }}
                    className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" /> Unlock (₦5,000)
                  </button>
                ) : matchedQuest ? (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectQuest(matchedQuest);
                      sounds.playClick();
                    }}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs shadow-xl flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-neutral-950" />
                    <span>{isCompleted ? 'Replay Boss Quest' : 'Challenge Boss'}</span>
                  </button>
                ) : (
                  <span className="text-xs text-neutral-500">Unlocks with progression</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

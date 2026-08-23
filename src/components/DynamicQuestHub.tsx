import React, { useState, useMemo } from 'react';
import { 
  Quest, 
  ChildProfile, 
  LanguageCode, 
  AnnotationType 
} from '../types';
import { LEVEL_INFOS } from '../data/levelInfo';
import { getTranslation } from '../i18n/translations';
import { 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Play, 
  Layers, 
  Image as ImageIcon, 
  MessageSquare, 
  Volume2, 
  Film, 
  Bot, 
  Award, 
  ArrowRight, 
  Filter, 
  Crown, 
  Flame,
  HelpCircle,
  Trophy
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface DynamicQuestHubProps {
  quests: Quest[];
  profile: ChildProfile;
  language: LanguageCode;
  onSelectQuest: (quest: Quest) => void;
  onOpenUpgradeModal: () => void;
  onOpenQuestBot: () => void;
  onOpenBossArena: () => void;
  onOpenLeaderboard?: () => void;
}

export const DynamicQuestHub: React.FC<DynamicQuestHubProps> = ({
  quests,
  profile,
  language,
  onSelectQuest,
  onOpenUpgradeModal,
  onOpenQuestBot,
  onOpenBossArena,
  onOpenLeaderboard,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(profile.level || 1);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  // Dynamic recommendation algorithm: Find the lowest-performing modality or the first uncompleted quest
  const recommendedQuest = useMemo(() => {
    const uncompleted = quests.filter(q => !profile.completed_quests.includes(q.id));
    if (uncompleted.length === 0) return quests[0];

    // Check learner's stats
    const stats = profile.accuracy_stats;
    const rates: Array<{ type: AnnotationType; rate: number }> = [
      { type: 'IMAGE_BOUNDING_BOX', rate: stats.image.attempts > 0 ? stats.image.successes / stats.image.attempts : 0.5 },
      { type: 'TEXT_SENTIMENT', rate: stats.text.attempts > 0 ? stats.text.successes / stats.text.attempts : 0.5 },
      { type: 'AUDIO_CLASSIFICATION', rate: stats.audio.attempts > 0 ? stats.audio.successes / stats.audio.attempts : 0.5 },
      { type: 'VIDEO_TRACKING', rate: stats.video.attempts > 0 ? stats.video.successes / stats.video.attempts : 0.5 },
      { type: 'QA_INSPECTION', rate: stats.qa.attempts > 0 ? stats.qa.successes / stats.qa.attempts : 0.5 },
    ];

    rates.sort((a, b) => a.rate - b.rate);
    const targetType = rates[0].type;

    const matched = uncompleted.find(q => q.annotation_type === targetType && (q.level === 1 || profile.is_premium_unlocked));
    return matched || uncompleted[0];
  }, [quests, profile]);

  // Filter quests by selected level & modality filter
  const filteredQuests = useMemo(() => {
    return quests.filter(q => {
      const matchLevel = q.level === selectedLevel;
      if (!matchLevel) return false;
      if (selectedTypeFilter === 'ALL') return true;
      if (selectedTypeFilter === 'IMAGE') return q.annotation_type === 'IMAGE_BOUNDING_BOX';
      if (selectedTypeFilter === 'TEXT') return q.annotation_type === 'TEXT_SENTIMENT';
      if (selectedTypeFilter === 'AUDIO') return q.annotation_type === 'AUDIO_CLASSIFICATION';
      if (selectedTypeFilter === 'VIDEO') return q.annotation_type === 'VIDEO_TRACKING';
      if (selectedTypeFilter === 'QA') return q.annotation_type === 'QA_INSPECTION';
      return true;
    });
  }, [quests, selectedLevel, selectedTypeFilter]);

  const activeLevelInfo = LEVEL_INFOS.find(l => l.level === selectedLevel) || LEVEL_INFOS[0];
  const isLevelLocked = !activeLevelInfo.isFree && !profile.is_premium_unlocked;

  const getTypeIcon = (type: AnnotationType) => {
    switch (type) {
      case 'IMAGE_BOUNDING_BOX': return <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />;
      case 'TEXT_SENTIMENT': return <MessageSquare className="w-3.5 h-3.5 text-blue-400" />;
      case 'AUDIO_CLASSIFICATION': return <Volume2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'VIDEO_TRACKING': return <Film className="w-3.5 h-3.5 text-purple-400" />;
      case 'QA_INSPECTION': return <Bot className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  return (
    <div id="quest-hub-container" className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 animate-fade-in">
      {/* Smart Dynamic Recommendation Hero Banner */}
      {recommendedQuest && (
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-neutral-900 to-neutral-900 border border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500 text-neutral-950 shadow">
                  🎯 RECOMMENDED FOR {profile.nickname.toUpperCase()}
                </span>
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Boosts AI Skills
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {recommendedQuest.title}
              </h2>
              <p className="text-xs md:text-sm text-neutral-300 mt-1 line-clamp-2">
                {recommendedQuest.instructions || recommendedQuest.instruction || recommendedQuest.description}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  +{recommendedQuest.xp_reward} XP
                </span>
                <span>•</span>
                <span>Level {recommendedQuest.level}</span>
                <span>•</span>
                <span>{recommendedQuest.estimated_time_min || recommendedQuest.estimated_minutes || 2} mins</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectQuest(recommendedQuest);
              sounds.playClick();
            }}
            className="w-full md:w-auto py-3.5 px-7 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Quest</span>
          </button>
        </div>
      )}

      {/* Level Roadmap Navigation Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              AI Learning Roadmap (Levels 1 to 5)
            </h3>
            <p className="text-xs text-neutral-400">
              From beginner data labeling to advanced AI Quality Inspector
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLeaderboard && (
              <button
                type="button"
                onClick={() => {
                  onOpenLeaderboard();
                  sounds.playClick();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Regional Leaderboard</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onOpenQuestBot();
                sounds.playClick();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-emerald-400 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Ask QuestBot</span>
            </button>
          </div>
        </div>

        {/* Level Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {LEVEL_INFOS.map((lvl) => {
            const isSelected = selectedLevel === lvl.level;
            const isLocked = !lvl.isFree && !profile.is_premium_unlocked;

            return (
              <button
                key={lvl.level}
                type="button"
                onClick={() => {
                  setSelectedLevel(lvl.level);
                  sounds.playClick();
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-950/70 border-emerald-500/80 ring-2 ring-emerald-500/30 text-white shadow-lg'
                    : 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    Lvl {lvl.level}
                  </span>
                  {isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                  ) : lvl.isFree ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                      FREE
                    </span>
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>

                <div className="font-bold text-xs leading-snug line-clamp-1">{lvl.title.replace(`Level ${lvl.level}: `, '')}</div>
                <p className="text-[10px] text-neutral-400 line-clamp-1">{lvl.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Info Details Box */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>{activeLevelInfo.title}</span>
            <span className="text-xs font-normal text-neutral-400">• {activeLevelInfo.subtitle}</span>
          </h4>
          <p className="text-xs text-neutral-300 mt-0.5">{activeLevelInfo.description}</p>
        </div>

        {/* Boss Arena Shortcut Button */}
        <button
          type="button"
          onClick={() => {
            onOpenBossArena();
            sounds.playClick();
          }}
          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all"
        >
          <Crown className="w-4 h-4" />
          <span>Boss: {activeLevelInfo.bossQuestTitle}</span>
        </button>
      </div>

      {/* Premium Unlock Banner (if viewing locked levels) */}
      {isLevelLocked && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/50 via-neutral-900 to-amber-950/50 border border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">Unlock All Levels 2, 3, 4 & 5</h4>
              <p className="text-xs text-neutral-300">
                Single pass unlocks advanced bounding boxes, QA Inspector mode, and AI certifications for only ₦5,000 / 3 Months.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onOpenUpgradeModal();
              sounds.playClick();
            }}
            className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-lg transition-all transform active:scale-95"
          >
            Unlock Now (₦5,000)
          </button>
        </div>
      )}

      {/* Modality Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1 pl-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter by Type:
        </span>
        {[
          { id: 'ALL', label: 'All Modalities' },
          { id: 'IMAGE', label: '🖼️ Image Vision' },
          { id: 'TEXT', label: '💬 Text & NLP' },
          { id: 'AUDIO', label: '🎧 Audio & Sounds' },
          { id: 'VIDEO', label: '🎬 Video Tracking' },
          { id: 'QA', label: '🔍 QA Reviewer' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setSelectedTypeFilter(f.id);
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedTypeFilter === f.id
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuests.map((quest) => {
          const isCompleted = profile.completed_quests.includes(quest.id);
          const isLocked = !activeLevelInfo.isFree && !profile.is_premium_unlocked;

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
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 cursor-pointer group relative overflow-hidden ${
                isCompleted
                  ? 'bg-neutral-900/60 border-emerald-500/30'
                  : 'bg-neutral-900 border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-850 shadow-md'
              }`}
            >
              {/* Header tags */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    {getTypeIcon(quest.annotation_type)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {quest.dataset_context}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isCompleted && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  )}
                  {isLocked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                </div>
              </div>

              {/* Quest Title & Objective */}
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {quest.title}
                </h4>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {quest.learning_objective}
                </p>
              </div>

              {/* Footer XP and action */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-400">+{quest.xp_reward} XP</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-400">{quest.estimated_time_min || quest.estimated_minutes || 2} min</span>
                </div>

                <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Start <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

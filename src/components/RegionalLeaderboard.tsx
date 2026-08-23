import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Medal, 
  Flame, 
  Sparkles, 
  Globe, 
  Shield, 
  Target, 
  Search, 
  ChevronRight, 
  Crown, 
  Star, 
  Heart, 
  Zap, 
  Award, 
  Layers, 
  Bot, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Filter,
  ArrowUpRight,
  Share2,
  PartyPopper
} from 'lucide-react';
import { 
  AfricanRegion, 
  RegionalLearner, 
  REGION_SUMMARIES, 
  INITIAL_LEADERBOARD_LEARNERS 
} from '../data/leaderboardData';
import { ChildProfile, LanguageCode } from '../types';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface RegionalLeaderboardProps {
  activeProfile: ChildProfile;
  language: LanguageCode;
  onNavigateToQuest: () => void;
  onOpenUpgradeModal?: () => void;
}

type SortCategory = 'XP' | 'ACCURACY' | 'STREAK' | 'AI_ERRORS' | 'QUESTS';
type TimeWindow = 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';

export const RegionalLeaderboard: React.FC<RegionalLeaderboardProps> = ({
  activeProfile,
  language,
  onNavigateToQuest,
  onOpenUpgradeModal,
}) => {
  // State
  const [selectedRegion, setSelectedRegion] = useState<AfricanRegion>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [sortCategory, setSortCategory] = useState<SortCategory>('XP');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('WEEKLY');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [learnersList, setLearnersList] = useState<RegionalLearner[]>(() => {
    // Inject active user's current live stats into the list
    return INITIAL_LEADERBOARD_LEARNERS.map(l => {
      if (l.isCurrentUser) {
        return {
          ...l,
          nickname: activeProfile.nickname || l.nickname,
          avatar: activeProfile.avatar || l.avatar,
          totalXp: activeProfile.xp,
          level: typeof activeProfile.level === 'number' ? activeProfile.level : 1,
          streakDays: activeProfile.streak_days,
          questsCompleted: activeProfile.completed_quests.length || 5,
        };
      }
      return l;
    });
  });

  const [selectedLearnerForModal, setSelectedLearnerForModal] = useState<RegionalLearner | null>(null);
  const [kudosGiven, setKudosGiven] = useState<Record<string, number>>({});
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Available unique countries for the filter
  const availableCountries = useMemo(() => {
    const countries = Array.from(new Set(learnersList.map(l => l.country))).sort();
    return ['ALL', ...countries];
  }, [learnersList]);

  // Filter and sort learners
  const processedLearners = useMemo(() => {
    let list = [...learnersList];

    // Filter by Region
    if (selectedRegion !== 'ALL') {
      list = list.filter(l => l.region === selectedRegion);
    }

    // Filter by Country
    if (selectedCountry !== 'ALL') {
      list = list.filter(l => l.country === selectedCountry);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(l => 
        l.nickname.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q) ||
        (l.schoolOrClub && l.schoolOrClub.toLowerCase().includes(q))
      );
    }

    // Sort by Category
    list.sort((a, b) => {
      if (sortCategory === 'XP') return b.totalXp - a.totalXp;
      if (sortCategory === 'ACCURACY') return b.accuracyPercent - a.accuracyPercent;
      if (sortCategory === 'STREAK') return b.streakDays - a.streakDays;
      if (sortCategory === 'AI_ERRORS') return b.aiErrorsCaught - a.aiErrorsCaught;
      if (sortCategory === 'QUESTS') return b.questsCompleted - a.questsCompleted;
      return 0;
    });

    // Assign rank
    return list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [learnersList, selectedRegion, selectedCountry, searchQuery, sortCategory]);

  // Current user's calculated position in the active filtered list
  const currentUserEntry = useMemo(() => {
    return processedLearners.find(l => l.isCurrentUser);
  }, [processedLearners]);

  // Confetti Animation for Top 10
  const fireTopTenConfetti = () => {
    sounds.playFanfare();
    try {
      // First salvo - left & right cannons
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#FBBF24'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#FBBF24'],
      });

      // Second burst - center star burst
      setTimeout(() => {
        try {
          confetti({
            particleCount: 40,
            spread: 100,
            origin: { x: 0.5, y: 0.5 },
            colors: ['#FFD700', '#FFA500', '#00FFFF', '#7FFF00', '#FF1493'],
            shapes: ['circle', 'square'],
          });
        } catch {}
      }, 250);
    } catch {}
  };

  // Trigger confetti animation when user reaches / is in top 10
  const hasTriggeredTop10ForRank = useRef<number | null>(null);

  useEffect(() => {
    if (currentUserEntry?.rank && currentUserEntry.rank <= 10) {
      if (hasTriggeredTop10ForRank.current !== currentUserEntry.rank) {
        hasTriggeredTop10ForRank.current = currentUserEntry.rank;
        fireTopTenConfetti();
      }
    }
  }, [currentUserEntry?.rank]);

  // Give Kudos Handler
  const handleGiveKudos = (learnerId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sounds.playSuccessChime();

    setKudosGiven(prev => ({
      ...prev,
      [learnerId]: (prev[learnerId] || 0) + 1,
    }));

    setLearnersList(prev => prev.map(l => {
      if (l.id === learnerId) {
        return { ...l, kudosCount: l.kudosCount + 1 };
      }
      return l;
    }));

    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'],
      });
    } catch {}
  };

  const handleShareCard = (learner: RegionalLearner) => {
    sounds.playClick();
    navigator.clipboard?.writeText(
      `🌟 Check out ${learner.nickname}'s ranking on DataKidQuest Africa! Rank #${learner.rank} with ${learner.totalXp} XP in ${learner.country}! 🌍`
    );
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const currentRegionSummary = REGION_SUMMARIES[selectedRegion];
  const topThree = processedLearners.slice(0, 3);
  const remainingLearners = processedLearners.slice(3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 animate-fade-in text-white">
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400/40 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>Learner rank card link copied to clipboard!</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Trophy className="w-3.5 h-3.5" />
                African AI Community Hub
              </span>
              <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 text-[11px] font-semibold border border-neutral-700 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                100% Pseudonymous &amp; Safe
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
              Regional AI Champions Leaderboard 🌍
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Celebrating young African explorers teaching AI models about local accents, traffic, Nigerian Pidgin, Yorùbá, Hausa, Igbo, and indigenous biodiversity.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playFanfare();
                onNavigateToQuest();
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transform active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-neutral-950" />
              <span>Complete Quests to Rank Up</span>
            </button>
          </div>
        </div>

        {/* Collective Regional Impact Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-800/80">
          <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-white">{(currentRegionSummary.totalXp).toLocaleString()}</div>
              <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Collective XP</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-emerald-400">{currentRegionSummary.accuracyAvg}%</div>
              <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Avg Accuracy</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-white">{currentRegionSummary.learnerCount.toLocaleString()}</div>
              <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Active Learners</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-purple-300">24,890+</div>
              <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">AI Errors Caught</div>
            </div>
          </div>
        </div>

        {/* Active Regional Sprint Bar */}
        <div className="mt-4 p-4 rounded-2xl bg-neutral-950/90 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentRegionSummary.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  Active Challenge: {currentRegionSummary.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                  {currentRegionSummary.sprintProgress}% Complete
                </span>
              </div>
              <div className="text-xs text-neutral-200 mt-0.5">
                {currentRegionSummary.currentSprint}
              </div>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-neutral-800 h-2.5 rounded-full overflow-hidden shrink-0 border border-neutral-700">
            <div 
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-700" 
              style={{ width: `${currentRegionSummary.sprintProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* User's Own Standings Highlight Box */}
      {currentUserEntry && (
        <div className={`p-4 sm:p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
          currentUserEntry.rank && currentUserEntry.rank <= 10
            ? 'bg-gradient-to-r from-amber-950/70 via-neutral-900 to-emerald-950/70 border-2 border-amber-500/60 ring-1 ring-amber-400/30'
            : 'bg-gradient-to-r from-emerald-950/70 via-neutral-900 to-teal-950/60 border-2 border-emerald-500/40'
        }`}>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className={`w-14 h-14 rounded-2xl p-0.5 shadow-lg shrink-0 ${
              currentUserEntry.rank && currentUserEntry.rank <= 10
                ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-emerald-400'
                : 'bg-gradient-to-tr from-emerald-500 to-amber-500'
            }`}>
              <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-2xl font-bold">
                {currentUserEntry.avatar}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${
                  currentUserEntry.rank && currentUserEntry.rank <= 10
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  <Trophy className="w-3 h-3 text-amber-400" />
                  Your Current Rank: #{currentUserEntry.rank}
                </span>

                {currentUserEntry.rank && currentUserEntry.rank <= 10 && (
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 shadow-sm uppercase tracking-wide flex items-center gap-1">
                    <PartyPopper className="w-3 h-3 fill-neutral-950" />
                    Top 10 Champion!
                  </span>
                )}

                <span className="text-xs text-neutral-400">
                  in {selectedRegion === 'ALL' ? 'Pan-Africa' : currentRegionSummary.name}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1 flex items-center gap-2">
                {currentUserEntry.nickname} <span className="text-xs text-neutral-400 font-normal">({currentUserEntry.city}, {currentUserEntry.country})</span>
              </h3>
              <p className="text-xs text-neutral-300 mt-0.5">
                Level {currentUserEntry.level} • {currentUserEntry.totalXp} XP earned • {currentUserEntry.streakDays}-day streak 🔥
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-neutral-800">
            {currentUserEntry.rank && currentUserEntry.rank <= 10 ? (
              <button
                type="button"
                onClick={fireTopTenConfetti}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 text-xs font-black flex items-center gap-1.5 shadow-lg transition-all cursor-pointer transform active:scale-95"
                title="Celebrate your Top 10 ranking with confetti!"
              >
                <PartyPopper className="w-4 h-4 fill-neutral-950" />
                <span>Celebrate! 🎉</span>
              </button>
            ) : (
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-neutral-400">Next Target</div>
                <div className="text-xs font-black text-amber-400">+50 XP to Next Rank</div>
              </div>
            )}

            <button
              type="button"
              onClick={onNavigateToQuest}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <span>Play Next Quest</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-4 sm:p-5 flex flex-col gap-4 shadow-lg">
        {/* Region Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {(['ALL', 'WEST', 'EAST', 'SOUTH', 'NORTH', 'CENTRAL'] as AfricanRegion[]).map((reg) => {
            const summary = REGION_SUMMARIES[reg];
            const isSelected = selectedRegion === reg;
            return (
              <button
                key={reg}
                type="button"
                onClick={() => {
                  setSelectedRegion(reg);
                  sounds.playClick();
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md scale-105'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
                }`}
              >
                <span>{summary.flag}</span>
                <span>{summary.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                  {summary.learnerCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-800/80">
          {/* Search box & Country selector */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search learner, city or school..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Country Selector */}
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  sounds.playClick();
                }}
                className="py-2 px-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-neutral-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">All Countries ({availableCountries.length - 1})</option>
                {availableCountries.filter(c => c !== 'ALL').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sorting and Category Metrics */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto justify-end">
            <span className="text-[10px] uppercase font-bold text-neutral-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Rank By:
            </span>

            {[
              { id: 'XP' as SortCategory, label: 'Total XP', icon: Trophy },
              { id: 'ACCURACY' as SortCategory, label: 'Accuracy %', icon: Target },
              { id: 'STREAK' as SortCategory, label: 'Streak 🔥', icon: Flame },
              { id: 'AI_ERRORS' as SortCategory, label: 'AI Errors Caught', icon: Bot },
              { id: 'QUESTS' as SortCategory, label: 'Quests', icon: Layers },
            ].map((cat) => {
              const isSelected = sortCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSortCategory(cat.id);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 3 Podium (Gold, Silver, Bronze) */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Silver #2 */}
          {topThree[1] && (
            <div 
              onClick={() => setSelectedLearnerForModal(topThree[1])}
              className="order-2 md:order-1 relative rounded-3xl bg-gradient-to-b from-neutral-800/90 to-neutral-950 border border-neutral-700/60 p-5 shadow-xl hover:border-neutral-500 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="absolute top-4 right-4 text-2xl font-black text-neutral-400 flex items-center gap-1">
                <Medal className="w-6 h-6 text-slate-300" />
                <span>#2</span>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-300 to-slate-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-neutral-900 rounded-[14px] flex items-center justify-center text-2xl">
                      {topThree[1].avatar}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white group-hover:text-amber-400 transition-colors">
                        {topThree[1].nickname}
                      </span>
                      <span>{topThree[1].flag}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      {topThree[1].city}, {topThree[1].country}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-semibold inline-block mt-1">
                      {topThree[1].levelTitle} (Lvl {topThree[1].level})
                    </span>
                  </div>
                </div>

                <div className="my-4 p-3 rounded-2xl bg-neutral-900 border border-neutral-800 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs font-black text-amber-400">{topThree[1].totalXp}</div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">XP</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-400">{topThree[1].accuracyPercent}%</div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-purple-300">{topThree[1].aiErrorsCaught}</div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">AI Caught</div>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-300 italic line-clamp-2">
                  &ldquo;{topThree[1].recentAchievement}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-medium">
                  {topThree[1].schoolOrClub}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleGiveKudos(topThree[1].id, e)}
                  className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{topThree[1].kudosCount} Cheers</span>
                </button>
              </div>
            </div>
          )}

          {/* Gold #1 (Center, Elevated) */}
          {topThree[0] && (
            <div 
              onClick={() => setSelectedLearnerForModal(topThree[0])}
              className="order-1 md:order-2 relative rounded-3xl bg-gradient-to-b from-amber-950/80 via-neutral-900 to-neutral-950 border-2 border-amber-500/60 p-6 shadow-2xl hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between transform md:-translate-y-2"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 font-black text-[11px] shadow-lg uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-neutral-950" />
                Regional Leader #1
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 p-0.5 shadow-xl group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-3xl">
                      {topThree[0].avatar}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                        {topThree[0].nickname}
                      </span>
                      <span className="text-base">{topThree[0].flag}</span>
                    </div>
                    <p className="text-xs text-neutral-300">
                      {topThree[0].city}, {topThree[0].country}
                    </p>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold inline-block mt-1">
                      {topThree[0].levelTitle} (Lvl {topThree[0].level})
                    </span>
                  </div>
                </div>

                <div className="my-4 p-3.5 rounded-2xl bg-neutral-950 border border-amber-500/30 grid grid-cols-3 gap-2 text-center shadow-inner">
                  <div>
                    <div className="text-sm font-black text-amber-400">{topThree[0].totalXp}</div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">XP</div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-emerald-400">{topThree[0].accuracyPercent}%</div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-purple-300">{topThree[0].aiErrorsCaught}</div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">AI Caught</div>
                  </div>
                </div>

                <p className="text-xs text-amber-200/90 font-medium italic line-clamp-2">
                  &ldquo;{topThree[0].recentAchievement}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-semibold">
                  🏫 {topThree[0].schoolOrClub}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleGiveKudos(topThree[0].id, e)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
                  <span>{topThree[0].kudosCount} Cheers</span>
                </button>
              </div>
            </div>
          )}

          {/* Bronze #3 */}
          {topThree[2] && (
            <div 
              onClick={() => setSelectedLearnerForModal(topThree[2])}
              className="order-3 relative rounded-3xl bg-gradient-to-b from-neutral-800/90 to-neutral-950 border border-neutral-700/60 p-5 shadow-xl hover:border-neutral-500 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="absolute top-4 right-4 text-2xl font-black text-amber-700 flex items-center gap-1">
                <Medal className="w-6 h-6 text-amber-600" />
                <span>#3</span>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-900 p-0.5 shadow-md group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-neutral-900 rounded-[14px] flex items-center justify-center text-2xl">
                      {topThree[2].avatar}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white group-hover:text-amber-400 transition-colors">
                        {topThree[2].nickname}
                      </span>
                      <span>{topThree[2].flag}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      {topThree[2].city}, {topThree[2].country}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-semibold inline-block mt-1">
                      {topThree[2].levelTitle} (Lvl {topThree[2].level})
                    </span>
                  </div>
                </div>

                <div className="my-4 p-3 rounded-2xl bg-neutral-900 border border-neutral-800 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs font-black text-amber-400">{topThree[2].totalXp}</div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">XP</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-400">{topThree[2].accuracyPercent}%</div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-purple-300">{topThree[2].aiErrorsCaught}</div>
                    <div className="text-[9px] text-neutral-400 uppercase font-bold">AI Caught</div>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-300 italic line-clamp-2">
                  &ldquo;{topThree[2].recentAchievement}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-medium">
                  {topThree[2].schoolOrClub}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleGiveKudos(topThree[2].id, e)}
                  className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{topThree[2].kudosCount} Cheers</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Leaderboard Table / Card List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm sm:text-base font-black text-white">
              Full Standings ({processedLearners.length} Young AI Pioneers)
            </h2>
          </div>
          <span className="text-xs text-neutral-400">
            Updated in Real-Time ⚡
          </span>
        </div>

        <div className="divide-y divide-neutral-800/70">
          {processedLearners.length === 0 ? (
            <div className="p-12 text-center text-neutral-400 flex flex-col items-center justify-center gap-3">
              <Search className="w-8 h-8 text-neutral-600" />
              <p className="text-sm font-semibold">No learners matched your filter criteria.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedRegion('ALL');
                  setSelectedCountry('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            processedLearners.map((learner) => {
              const isMe = learner.isCurrentUser;
              return (
                <div
                  key={learner.id}
                  onClick={() => setSelectedLearnerForModal(learner)}
                  className={`p-3.5 sm:p-4.5 flex items-center justify-between gap-3 sm:gap-4 transition-all hover:bg-neutral-800/60 cursor-pointer ${
                    isMe ? 'bg-emerald-950/40 border-l-4 border-emerald-500' : ''
                  }`}
                >
                  {/* Left: Rank & Avatar & Info */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-7 sm:w-8 text-center font-black text-xs sm:text-sm text-neutral-400">
                      {learner.rank === 1 ? (
                        <span className="text-amber-400 text-base">🥇</span>
                      ) : learner.rank === 2 ? (
                        <span className="text-slate-300 text-base">🥈</span>
                      ) : learner.rank === 3 ? (
                        <span className="text-amber-600 text-base">🥉</span>
                      ) : (
                        `#${learner.rank}`
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-inner">
                      {learner.avatar}
                    </div>

                    {/* Learner Meta */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-black truncate ${isMe ? 'text-emerald-400' : 'text-white'}`}>
                          {learner.nickname}
                        </span>
                        <span>{learner.flag}</span>
                        {isMe && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            YOU
                          </span>
                        )}
                        <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 font-mono">
                          Lvl {learner.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400 truncate">
                        <span>{learner.city}, {learner.country}</span>
                        {learner.schoolOrClub && (
                          <>
                            <span>•</span>
                            <span className="truncate hidden md:inline">{learner.schoolOrClub}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Metric Stats & Kudos Button */}
                  <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    {/* Primary Metric based on sortCategory */}
                    <div className="text-right">
                      {sortCategory === 'XP' && (
                        <>
                          <div className="text-xs sm:text-sm font-black text-amber-400">{learner.totalXp} XP</div>
                          <div className="text-[9px] text-neutral-400 font-semibold">{learner.questsCompleted} quests</div>
                        </>
                      )}
                      {sortCategory === 'ACCURACY' && (
                        <>
                          <div className="text-xs sm:text-sm font-black text-emerald-400">{learner.accuracyPercent}%</div>
                          <div className="text-[9px] text-neutral-400 font-semibold">Gold Precision</div>
                        </>
                      )}
                      {sortCategory === 'STREAK' && (
                        <>
                          <div className="text-xs sm:text-sm font-black text-amber-500 flex items-center justify-end gap-1">
                            <Flame className="w-3.5 h-3.5 fill-amber-500" />
                            {learner.streakDays} Days
                          </div>
                          <div className="text-[9px] text-neutral-400 font-semibold">Active Streak</div>
                        </>
                      )}
                      {sortCategory === 'AI_ERRORS' && (
                        <>
                          <div className="text-xs sm:text-sm font-black text-purple-300">{learner.aiErrorsCaught} Caught</div>
                          <div className="text-[9px] text-neutral-400 font-semibold">Bugs Spotted</div>
                        </>
                      )}
                      {sortCategory === 'QUESTS' && (
                        <>
                          <div className="text-xs sm:text-sm font-black text-blue-400">{learner.questsCompleted} Done</div>
                          <div className="text-[9px] text-neutral-400 font-semibold">{learner.totalXp} XP</div>
                        </>
                      )}
                    </div>

                    {/* Cheers Button */}
                    <button
                      type="button"
                      onClick={(e) => handleGiveKudos(learner.id, e)}
                      title="Cheer on this learner!"
                      className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                        kudosGiven[learner.id]
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border-neutral-700/80'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${kudosGiven[learner.id] ? 'fill-rose-400 text-rose-400' : 'text-neutral-400'}`} />
                      <span className="hidden sm:inline">{learner.kudosCount}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detail Modal for Selected Learner */}
      {selectedLearnerForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative flex flex-col text-white">
            <button
              type="button"
              onClick={() => setSelectedLearnerForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
            >
              ✕
            </button>

            {/* Avatar & Title */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 p-0.5 shadow-lg">
                <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-3xl">
                  {selectedLearnerForModal.avatar}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-black text-white">{selectedLearnerForModal.nickname}</h3>
                  <span className="text-lg">{selectedLearnerForModal.flag}</span>
                </div>
                <p className="text-xs text-neutral-300">
                  {selectedLearnerForModal.city}, {selectedLearnerForModal.country}
                </p>
                <div className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 inline-block mt-1">
                  {selectedLearnerForModal.levelTitle} (Level {selectedLearnerForModal.level})
                </div>
              </div>
            </div>

            {/* School / Club Tag */}
            {selectedLearnerForModal.schoolOrClub && (
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2 mb-4">
                <span className="text-base">🏫</span>
                <span><strong>Community Hub:</strong> {selectedLearnerForModal.schoolOrClub}</span>
              </div>
            )}

            {/* Performance Stats Matrix */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="text-xs text-neutral-400 font-semibold">Total Experience</div>
                <div className="text-base font-black text-amber-400 mt-0.5">{selectedLearnerForModal.totalXp} XP</div>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="text-xs text-neutral-400 font-semibold">Accuracy Score</div>
                <div className="text-base font-black text-emerald-400 mt-0.5">{selectedLearnerForModal.accuracyPercent}%</div>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="text-xs text-neutral-400 font-semibold">Daily Streak</div>
                <div className="text-base font-black text-amber-500 mt-0.5">{selectedLearnerForModal.streakDays} Days 🔥</div>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="text-xs text-neutral-400 font-semibold">AI Mistakes Caught</div>
                <div className="text-base font-black text-purple-300 mt-0.5">{selectedLearnerForModal.aiErrorsCaught} Detected 🕵️</div>
              </div>
            </div>

            {/* Recent Feat */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 mb-5">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Award className="w-4 h-4 text-amber-400" />
                Special Achievement:
              </div>
              <p className="italic">&ldquo;{selectedLearnerForModal.recentAchievement}&rdquo;</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleGiveKudos(selectedLearnerForModal.id)}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-neutral-950" />
                <span>Send Cheers ({selectedLearnerForModal.kudosCount})</span>
              </button>

              <button
                type="button"
                onClick={() => handleShareCard(selectedLearnerForModal)}
                className="py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Share this card"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

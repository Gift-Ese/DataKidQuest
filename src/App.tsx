import React, { useState, useEffect } from 'react';
import { 
  Quest, 
  ChildProfile, 
  LanguageCode, 
  UserRole, 
  AppView, 
  EvaluationResult 
} from './types';
import { INITIAL_QUESTS } from './data/initialQuests';
import { Navbar } from './components/Navbar';
import { DynamicQuestHub } from './components/DynamicQuestHub';
import { AnnotationWorkspace } from './components/AnnotationWorkspace';
import { ParentDashboard } from './components/ParentDashboard';
import { SponsorshipHub } from './components/SponsorshipHub';
import { AdminPortal } from './components/AdminPortal';
import { BossQuestArena } from './components/BossQuestArena';
import { CatchAIZone } from './components/CatchAIZone';
import { RegionalLeaderboard } from './components/RegionalLeaderboard';
import { FirstAhaModal } from './components/FirstAhaModal';
import { QuestBotModal } from './components/QuestBotModal';
import { ChildOnboardingModal } from './components/ChildOnboardingModal';
import { UpgradeModal } from './components/UpgradeModal';
import { sounds } from './utils/soundEffects';

const STORAGE_KEY_PROFILE = 'datakidquest_profile_v2';
const STORAGE_KEY_QUESTS = 'datakidquest_quests_v2';

const DEFAULT_PROFILE: ChildProfile = {
  id: 'profile_default_1',
  nickname: 'TundeAI',
  age_group: '10-13',
  avatar: '🦁',
  preferred_language: 'en-NG',
  xp: 120,
  streak_days: 3,
  level: 1,
  completed_quests: [],
  badges: ['first_annotation'],
  is_premium_unlocked: false,
  accuracy_stats: {
    image: { attempts: 2, successes: 2, avgIoU: 0.82 },
    text: { attempts: 1, successes: 1 },
    audio: { attempts: 1, successes: 1 },
    video: { attempts: 0, successes: 0 },
    qa: { attempts: 1, successes: 1 },
  },
};

export default function App() {
  // Quests state
  const [quests, setQuests] = useState<Quest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUESTS);
      return saved ? JSON.parse(saved) : INITIAL_QUESTS;
    } catch {
      return INITIAL_QUESTS;
    }
  });

  // Active Learner Profile state
  const [profile, setProfile] = useState<ChildProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Routing & Modals state
  const [currentView, setCurrentView] = useState<AppView>('QUEST_HUB');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(profile.preferred_language || 'en-NG');
  const [userRole, setUserRole] = useState<UserRole>('CHILD');

  const [showFirstAhaModal, setShowFirstAhaModal] = useState(false);
  const [showQuestBotModal, setShowQuestBotModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Sync quests to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTS, JSON.stringify(quests));
    } catch {}
  }, [quests]);

  const handleQuestCompleted = (questId: string, result: EvaluationResult, xpEarned: number) => {
    const isNewCompletion = !profile.completed_quests.includes(questId);
    const updatedCompleted = isNewCompletion ? [...profile.completed_quests, questId] : profile.completed_quests;
    const newXp = profile.xp + xpEarned;

    // Update level if threshold reached
    let newLevel = profile.level;
    if (newXp >= 1000) newLevel = Math.max(newLevel, 5);
    else if (newXp >= 600) newLevel = Math.max(newLevel, 4);
    else if (newXp >= 350) newLevel = Math.max(newLevel, 3);
    else if (newXp >= 150) newLevel = Math.max(newLevel, 2);

    // Update modality stats
    const q = quests.find(item => item.id === questId);
    const stats = { ...profile.accuracy_stats };

    if (q) {
      if (q.annotation_type === 'IMAGE_BOUNDING_BOX') {
        stats.image.attempts += 1;
        if (result.passed) stats.image.successes += 1;
        if (result.iouScore) {
          stats.image.avgIoU = (stats.image.avgIoU + result.iouScore) / 2;
        }
      } else if (q.annotation_type === 'TEXT_SENTIMENT') {
        stats.text.attempts += 1;
        if (result.passed) stats.text.successes += 1;
      } else if (q.annotation_type === 'AUDIO_CLASSIFICATION') {
        stats.audio.attempts += 1;
        if (result.passed) stats.audio.successes += 1;
      } else if (q.annotation_type === 'VIDEO_TRACKING') {
        stats.video.attempts += 1;
        if (result.passed) stats.video.successes += 1;
      } else if (q.annotation_type === 'QA_INSPECTION') {
        stats.qa.attempts += 1;
        if (result.passed) stats.qa.successes += 1;
      }
    }

    setProfile(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel,
      completed_quests: updatedCompleted,
      accuracy_stats: stats,
    }));

    // Return to quest hub
    setCurrentView('QUEST_HUB');
    setSelectedQuest(null);
  };

  const handleLaunchQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setCurrentView('WORKSPACE');
  };

  const handleAddCustomQuest = (newQuest: Quest) => {
    setQuests(prev => [newQuest, ...prev]);
  };

  const handleUnlockPremium = () => {
    setProfile(prev => ({ ...prev, is_premium_unlocked: true }));
    setShowUpgradeModal(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-neutral-950 font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        activeProfile={profile}
        currentLanguage={currentLanguage}
        onChangeLanguage={(lang) => {
          setCurrentLanguage(lang);
          setProfile(p => ({ ...p, preferred_language: lang }));
        }}
        userRole={userRole}
        onChangeUserRole={setUserRole}
        onOpenSwitchProfile={() => setShowOnboardingModal(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col pb-16">
        {currentView === 'QUEST_HUB' && (
          <DynamicQuestHub
            quests={quests}
            profile={profile}
            language={currentLanguage}
            onSelectQuest={handleLaunchQuest}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
            onOpenQuestBot={() => setShowQuestBotModal(true)}
            onOpenBossArena={() => setCurrentView('BOSS_ARENA')}
            onOpenLeaderboard={() => setCurrentView('LEADERBOARD')}
          />
        )}

        {currentView === 'LEADERBOARD' && (
          <RegionalLeaderboard
            activeProfile={profile}
            language={currentLanguage}
            onNavigateToQuest={() => setCurrentView('QUEST_HUB')}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          />
        )}

        {currentView === 'WORKSPACE' && selectedQuest && (
          <AnnotationWorkspace
            quest={selectedQuest}
            profile={profile}
            language={currentLanguage}
            onBack={() => {
              setCurrentView('QUEST_HUB');
              setSelectedQuest(null);
            }}
            onQuestCompleted={handleQuestCompleted}
            onOpenQuestBot={() => setShowQuestBotModal(true)}
            onTriggerFirstAha={() => setShowFirstAhaModal(true)}
          />
        )}

        {currentView === 'BOSS_ARENA' && (
          <BossQuestArena
            quests={quests}
            profile={profile}
            language={currentLanguage}
            onSelectQuest={handleLaunchQuest}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
            onBack={() => setCurrentView('QUEST_HUB')}
          />
        )}

        {currentView === 'CATCH_AI_ZONE' && (
          <CatchAIZone
            quests={quests}
            profile={profile}
            language={currentLanguage}
            onSelectQuest={handleLaunchQuest}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          />
        )}

        {currentView === 'PARENT_DASHBOARD' && (
          <ParentDashboard
            profile={profile}
            language={currentLanguage}
            onUpdateProfile={setProfile}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          />
        )}

        {currentView === 'SPONSOR_PAGE' && (
          <SponsorshipHub
            language={currentLanguage}
            onBack={() => setCurrentView('QUEST_HUB')}
          />
        )}

        {currentView === 'ADMIN_PORTAL' && (
          <AdminPortal
            quests={quests}
            onAddQuest={handleAddCustomQuest}
            onBack={() => setCurrentView('QUEST_HUB')}
          />
        )}
      </main>

      {/* First Aha Moment Celebration Modal */}
      {showFirstAhaModal && (
        <FirstAhaModal
          language={currentLanguage}
          onClose={() => setShowFirstAhaModal(false)}
        />
      )}

      {/* QuestBot AI Assistant Dialog */}
      {showQuestBotModal && (
        <QuestBotModal
          quest={selectedQuest || undefined}
          language={currentLanguage}
          onClose={() => setShowQuestBotModal(false)}
        />
      )}

      {/* Learner Profile Switching / Onboarding Modal */}
      {showOnboardingModal && (
        <ChildOnboardingModal
          currentLanguage={currentLanguage}
          onSaveProfile={(newProf) => {
            setProfile(newProf);
            setCurrentLanguage(newProf.preferred_language);
            setShowOnboardingModal(false);
          }}
          onClose={() => setShowOnboardingModal(false)}
        />
      )}

      {/* Premium Upgrade Modal (₦5,000 / 3 Months) */}
      {showUpgradeModal && (
        <UpgradeModal
          onSuccess={handleUnlockPremium}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}

      {/* Persistent Footer */}
      <footer className="w-full bg-neutral-950 border-t border-neutral-900 py-6 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-neutral-400">DataKidQuest Africa</span>
            <span>• An MLQuest Africa AI Initiative</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>🛡️ Child Safe &amp; COPPA Compliant</span>
            <span>🌍 Multilingual: Yoruba, Igbo, Hausa, Pidgin, English</span>
            <span>🚀 Powered by Real AI Datasets</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

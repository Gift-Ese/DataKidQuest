import React, { useState } from 'react';
import { 
  AppView, 
  ChildProfile, 
  LanguageCode, 
  UserRole 
} from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations';
import { 
  Sparkles, 
  Globe, 
  Flame, 
  Trophy, 
  User, 
  Shield, 
  Heart, 
  Settings, 
  ChevronDown, 
  Bot, 
  Layers, 
  Crown,
  Menu,
  X
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  activeProfile: ChildProfile;
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  onOpenSwitchProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeProfile,
  currentLanguage,
  onChangeLanguage,
  userRole,
  onChangeUserRole,
  onOpenSwitchProfile,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Parent Logo */}
        <div 
          onClick={() => {
            onNavigate('QUEST_HUB');
            sounds.playClick();
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-emerald-400 font-black text-base">
              DQ
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent">
                DataKidQuest
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                AFRICA
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 tracking-wider uppercase font-semibold">
              MLQuest Africa • {getTranslation(currentLanguage, 'brand.tagline')}
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/90 p-1 rounded-2xl border border-neutral-800 shadow-inner">
          <button
            type="button"
            onClick={() => {
              onNavigate('QUEST_HUB');
              sounds.playClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'QUEST_HUB' || currentView === 'WORKSPACE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {getTranslation(currentLanguage, 'nav.quests')}
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate('LEADERBOARD');
              sounds.playClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'LEADERBOARD'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            {getTranslation(currentLanguage, 'nav.leaderboard')}
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate('CATCH_AI_ZONE');
              sounds.playClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'CATCH_AI_ZONE'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            {getTranslation(currentLanguage, 'nav.catchAi')}
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate('BOSS_ARENA');
              sounds.playClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'BOSS_ARENA'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            {getTranslation(currentLanguage, 'nav.bossQuests')}
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate('PARENT_DASHBOARD');
              sounds.playClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'PARENT_DASHBOARD'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            {getTranslation(currentLanguage, 'nav.parentPortal')}
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate('SPONSOR_PAGE');
              sounds.playClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'SPONSOR_PAGE'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            {getTranslation(currentLanguage, 'nav.sponsor')}
          </button>
        </nav>

        {/* Right Action Widgets (Language + Learner Stats + Role) */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{currentLangObj.flag} {currentLangObj.nativeName}</span>
              <span className="sm:hidden">{currentLangObj.flag}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-800 mb-1">
                  African Languages (Accessibility)
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onChangeLanguage(lang.code);
                      setLangMenuOpen(false);
                      sounds.playClick();
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-emerald-600/20 text-emerald-400 font-bold'
                        : 'text-neutral-200 hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Child XP & Streak Pills */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-amber-400">{activeProfile.streak_days}d</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs font-bold text-emerald-300 shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeProfile.xp} XP</span>
            </div>
          </div>

          {/* Active Profile Avatar Button */}
          <button
            type="button"
            onClick={onOpenSwitchProfile}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-all shadow-sm group"
            title="Switch Learner Profile"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center text-sm font-bold text-neutral-950 shadow">
              {activeProfile.avatar || '🦁'}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-neutral-200 block leading-tight">
                {activeProfile.nickname}
              </span>
              <span className="text-[9px] text-emerald-400 font-mono block leading-tight">
                Lvl {activeProfile.level} • {activeProfile.age_group}
              </span>
            </div>
          </button>

          {/* Role Switcher Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-all shadow-sm"
              title="Switch Platform Role"
            >
              <Settings className="w-4 h-4" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-800 mb-1">
                  Active View Role
                </div>
                {(['CHILD', 'PARENT', 'ADMIN', 'SPONSOR'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      onChangeUserRole(r);
                      setRoleMenuOpen(false);
                      if (r === 'ADMIN') onNavigate('ADMIN_PORTAL');
                      if (r === 'PARENT') onNavigate('PARENT_DASHBOARD');
                      if (r === 'SPONSOR') onNavigate('SPONSOR_PAGE');
                      if (r === 'CHILD') onNavigate('QUEST_HUB');
                      sounds.playClick();
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-colors ${
                      userRole === r
                        ? 'bg-emerald-600 text-white'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {r === 'CHILD' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                    {r === 'PARENT' && <Shield className="w-3.5 h-3.5 text-blue-400" />}
                    {r === 'ADMIN' && <Settings className="w-3.5 h-3.5 text-purple-400" />}
                    {r === 'SPONSOR' && <Heart className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{r === 'CHILD' ? 'Child Learner' : r === 'PARENT' ? 'Parent Hub' : r === 'ADMIN' ? 'Admin Studio' : 'Sponsor'}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-neutral-900 text-neutral-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden p-4 bg-neutral-950 border-b border-neutral-800 flex flex-col gap-2 animate-fade-in">
          <button
            type="button"
            onClick={() => {
              onNavigate('QUEST_HUB');
              setMobileMenuOpen(false);
              sounds.playClick();
            }}
            className="w-full p-3 rounded-xl bg-neutral-900 text-left text-sm font-bold text-white flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            {getTranslation(currentLanguage, 'nav.quests')}
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate('LEADERBOARD');
              setMobileMenuOpen(false);
              sounds.playClick();
            }}
            className="w-full p-3 rounded-xl bg-neutral-900 text-left text-sm font-bold text-white flex items-center gap-2"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            {getTranslation(currentLanguage, 'nav.leaderboard')}
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate('CATCH_AI_ZONE');
              setMobileMenuOpen(false);
              sounds.playClick();
            }}
            className="w-full p-3 rounded-xl bg-neutral-900 text-left text-sm font-bold text-white flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            {getTranslation(currentLanguage, 'nav.catchAi')}
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate('BOSS_ARENA');
              setMobileMenuOpen(false);
              sounds.playClick();
            }}
            className="w-full p-3 rounded-xl bg-neutral-900 text-left text-sm font-bold text-white flex items-center gap-2"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            {getTranslation(currentLanguage, 'nav.bossQuests')}
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate('PARENT_DASHBOARD');
              setMobileMenuOpen(false);
              sounds.playClick();
            }}
            className="w-full p-3 rounded-xl bg-neutral-900 text-left text-sm font-bold text-white flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            {getTranslation(currentLanguage, 'nav.parentPortal')}
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate('SPONSOR_PAGE');
              setMobileMenuOpen(false);
              sounds.playClick();
            }}
            className="w-full p-3 rounded-xl bg-neutral-900 text-left text-sm font-bold text-white flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            {getTranslation(currentLanguage, 'nav.sponsor')}
          </button>
        </div>
      )}
    </header>
  );
};

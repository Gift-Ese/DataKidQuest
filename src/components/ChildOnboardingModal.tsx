import React, { useState } from 'react';
import { ChildProfile, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations';
import { Sparkles, Shield, User, Globe, ArrowRight, Check } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ChildOnboardingModalProps {
  currentLanguage: LanguageCode;
  onSaveProfile: (profile: ChildProfile) => void;
  onClose?: () => void;
}

export const ChildOnboardingModal: React.FC<ChildOnboardingModalProps> = ({
  currentLanguage,
  onSaveProfile,
  onClose,
}) => {
  const [nickname, setNickname] = useState('TundeAI');
  const [avatar, setAvatar] = useState('🦁');
  const [ageGroup, setAgeGroup] = useState<'7-9' | '10-13' | '14-17'>('10-13');
  const [preferredLang, setPreferredLang] = useState<LanguageCode>(currentLanguage);

  const avatars = ['🦁', '🐆', '🦅', '🐘', '🤖', '🚀', '⭐', '🐬', '🦉', '⚡'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    sounds.playFanfare();
    const newProfile: ChildProfile = {
      id: `profile_${Date.now()}`,
      nickname: nickname.trim(),
      age_group: ageGroup,
      avatar,
      preferred_language: preferredLang,
      xp: 0,
      streak_days: 1,
      level: 1,
      completed_quests: [],
      badges: ['first_annotation'],
      is_premium_unlocked: false,
      accuracy_stats: {
        image: { attempts: 0, successes: 0, avgIoU: 0 },
        text: { attempts: 0, successes: 0 },
        audio: { attempts: 0, successes: 0 },
        video: { attempts: 0, successes: 0 },
        qa: { attempts: 0, successes: 0 },
      },
    };

    onSaveProfile(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-lg">
            <div className="w-full h-full bg-neutral-900 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Create AI Learner Profile</h3>
            <p className="text-xs text-neutral-400">Join DataKidQuest • Privacy & Child-Safe AI</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nickname Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
              Choose a Fun Nickname (No Real Names)
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. AminaData, ChidiQuest, ZainabML"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
              Pick Your AI Avatar
            </label>
            <div className="grid grid-cols-5 gap-2">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    setAvatar(av);
                    sounds.playClick();
                  }}
                  className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                    avatar === av
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 scale-105 shadow-md'
                      : 'bg-neutral-950 hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
              Age Group
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['7-9', '10-13', '14-17'] as const).map((ag) => (
                <button
                  key={ag}
                  type="button"
                  onClick={() => {
                    setAgeGroup(ag);
                    sounds.playClick();
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    ageGroup === ag
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-sm'
                      : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                  }`}
                >
                  {ag} Years
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Primary Learning Language
            </label>
            <select
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value as LanguageCode)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Safety Pledge */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-start gap-2.5 text-[11px] text-neutral-400">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Child-Safe Zone:</strong> No ads, no public chat, and zero tracking. All AI models run securely server-side.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
          >
            <span>Start My AI Quest!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

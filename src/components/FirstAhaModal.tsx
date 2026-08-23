import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Brain, Award, ArrowRight, UserCheck, Bot } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { getTranslation } from '../i18n/translations';
import { LanguageCode } from '../types';

interface FirstAhaModalProps {
  language: LanguageCode;
  onClose: () => void;
}

export const FirstAhaModal: React.FC<FirstAhaModalProps> = ({ language, onClose }) => {
  useEffect(() => {
    sounds.playFanfare();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'],
      });
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border-2 border-emerald-500/50 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        {/* Background glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Celebration Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-xl mb-4">
          <div className="w-full h-full bg-neutral-900 rounded-[22px] flex items-center justify-center text-emerald-400">
            <Sparkles className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2">
          {getTranslation(language, 'aha.title')}
        </h2>

        <p className="text-xs md:text-sm text-neutral-300 mb-6 max-w-sm italic">
          {getTranslation(language, 'aha.quote')}
        </p>

        {/* The 3-Step Machine Learning Pipeline */}
        <div className="w-full flex flex-col gap-2.5 text-left mb-6">
          <div className="p-3 bg-neutral-950/90 rounded-2xl border border-neutral-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Step 1: Human Intelligence</h4>
              <p className="text-[11px] text-neutral-400 leading-tight">
                {getTranslation(language, 'aha.step1')}
              </p>
            </div>
          </div>

          <div className="p-3 bg-neutral-950/90 rounded-2xl border border-neutral-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold text-sm">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Step 2: Machine Learning Patterns</h4>
              <p className="text-[11px] text-neutral-400 leading-tight">
                {getTranslation(language, 'aha.step2')}
              </p>
            </div>
          </div>

          <div className="p-3 bg-neutral-950/90 rounded-2xl border border-neutral-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-bold text-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Step 3: Smart AI Model Created!</h4>
              <p className="text-[11px] text-neutral-400 leading-tight">
                {getTranslation(language, 'aha.step3')}
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <span>{getTranslation(language, 'aha.continue')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

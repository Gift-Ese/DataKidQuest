import React from 'react';
import { Smile, Meh, Frown, MessageSquareQuote, CheckCircle2, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TextAnnotatorProps {
  textContent: string;
  category?: string;
  selectedSentiment?: string;
  onSelectSentiment: (sentiment: string) => void;
  availableLabels?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  disabled?: boolean;
}

export const TextAnnotator: React.FC<TextAnnotatorProps> = ({
  textContent,
  category,
  selectedSentiment,
  onSelectSentiment,
  availableLabels = ['positive', 'neutral', 'negative'],
  selectedCategory,
  onSelectCategory,
  disabled = false,
}) => {
  const sentimentOptions = [
    {
      id: 'positive',
      label: 'Positive / Happy (Ina Jin Dadi / Ayọ̀ / Ọṅụ)',
      sub: 'Expressing joy, gratitude, compliment, or success',
      icon: Smile,
      color: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
      activeColor: 'bg-emerald-500 text-white ring-2 ring-emerald-400 shadow-md',
    },
    {
      id: 'neutral',
      label: 'Neutral / Factual (Babu Nuna Jin Dadi / Ìròyìn / Ozi nkịtị)',
      sub: 'Objective facts, schedule information, or balanced statement',
      icon: Meh,
      color: 'bg-blue-500/15 border-blue-500/40 text-blue-400',
      activeColor: 'bg-blue-500 text-white ring-2 ring-blue-400 shadow-md',
    },
    {
      id: 'negative',
      label: 'Negative / Frustrated (Ba Dadi / Ìbànújẹ́ / Iwe)',
      sub: 'Disappointment, complaint, error report, or sadness',
      icon: Frown,
      color: 'bg-rose-500/15 border-rose-500/40 text-rose-400',
      activeColor: 'bg-rose-500 text-white ring-2 ring-rose-400 shadow-md',
    },
  ];

  return (
    <div id="text-annotator-container" className="flex flex-col gap-4 w-full">
      {/* African Context Text Card */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl relative shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MessageSquareQuote className="w-4 h-4" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Real NLP Dataset Text • {category || 'Multilingual Discourse'}
          </span>
        </div>

        <blockquote className="text-lg md:text-xl font-medium text-neutral-100 leading-relaxed font-serif pl-3 border-l-4 border-emerald-500 py-1">
          {textContent}
        </blockquote>

        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>🧠 NLP Feature: Context & Dialect Tone Analysis</span>
          <span>Child Safe Corpus Verified ✅</span>
        </div>
      </div>

      {/* Sentiment Decision Matrix */}
      <div className="flex flex-col gap-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Select the Sentiment (Tone / Emotion):
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sentimentOptions.map((opt) => {
            const isSelected = selectedSentiment === opt.id;
            const Icon = opt.icon;

            return (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onSelectSentiment(opt.id);
                  sounds.playClick();
                }}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? opt.activeColor
                    : `${opt.color} hover:bg-neutral-800/80 cursor-pointer`
                } ${disabled ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-bold text-sm">{opt.id.toUpperCase()}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <span className={`text-xs ${isSelected ? 'text-white/90' : 'text-neutral-300'}`}>
                  {opt.label}
                </span>
                <p className={`text-[11px] leading-tight ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
                  {opt.sub}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

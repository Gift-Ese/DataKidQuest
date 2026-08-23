import React, { useState } from 'react';
import { GroundTruthQA, QAErrorType } from '../types';
import { Bot, CheckCircle2, XCircle, AlertTriangle, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface QAInspectorGameProps {
  groundTruthQA: GroundTruthQA;
  userSaidCorrect: boolean | null;
  onSetUserSaidCorrect: (val: boolean) => void;
  selectedErrorType?: QAErrorType;
  onSelectErrorType: (errType: QAErrorType) => void;
  correctedAnswer: string;
  onChangeCorrectedAnswer: (ans: string) => void;
  availableLabels?: string[];
  disabled?: boolean;
}

export const QAInspectorGame: React.FC<QAInspectorGameProps> = ({
  groundTruthQA,
  userSaidCorrect,
  onSetUserSaidCorrect,
  selectedErrorType,
  onSelectErrorType,
  correctedAnswer,
  onChangeCorrectedAnswer,
  availableLabels = ['Goat', 'Dog', 'Sheep', 'Cow', 'Danfo Bus', 'Keke Napep', 'Pedestrian'],
  disabled = false,
}) => {
  const errorTypes: Array<{ type: QAErrorType; label: string; desc: string }> = [
    { type: 'WRONG_LABEL', label: 'Wrong Label / Category', desc: 'AI named the wrong object (e.g. called a Goat a Dog)' },
    { type: 'WRONG_BOUNDING_BOX', label: 'Bad Box Overlap', desc: 'Box is too loose, too small, or misses object edges' },
    { type: 'MISSING_OBJECT', label: 'Missing Object', desc: 'An object exists in the scene that AI overlooked' },
    { type: 'EXTRA_OBJECT', label: 'Extra / Hallucinated Box', desc: 'AI put a box on empty space where nothing exists' },
    { type: 'WRONG_TRANSCRIPTION', label: 'Wrong Words / Audio', desc: 'AI misheard audio or misinterpreted local slang' },
    { type: 'TRACKING_ERROR', label: 'Lost Tracking Path', desc: 'AI drifted off the object in video keyframes' },
  ];

  return (
    <div id="qa-inspector-container" className="flex flex-col gap-4 w-full">
      {/* AI Prediction Proposal Banner */}
      <div className="p-5 bg-gradient-to-r from-purple-950/40 via-neutral-900 to-purple-950/40 border border-purple-800/50 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                AI Computer Vision / NLP Prediction
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                {Math.round((groundTruthQA.aiProposal.confidence || 0.85) * 100)}% Confidence
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-0.5">
              AI says: &quot;{groundTruthQA.aiProposal.label || groundTruthQA.aiProposal.sentiment || 'Proposed Annotation'}&quot;
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 text-xs text-neutral-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Human-in-the-Loop QA Stage</span>
        </div>
      </div>

      {/* Decision: Did AI get it right? */}
      <div className="flex flex-col gap-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Did the AI Model Get This Right?
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              onSetUserSaidCorrect(true);
              sounds.playClick();
            }}
            className={`p-4 rounded-xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
              userSaidCorrect === true
                ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400 shadow-md'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>✅ YES, AI is Correct!</span>
            </div>
            <span className="text-xs opacity-75 font-normal">Meets Gold Quality</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              onSetUserSaidCorrect(false);
              sounds.playClick();
            }}
            className={`p-4 rounded-xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
              userSaidCorrect === false
                ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-400 shadow-md'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>❌ NO, I Caught an AI Mistake!</span>
            </div>
            <span className="text-xs opacity-75 font-normal">Needs Human Correction</span>
          </button>
        </div>
      </div>

      {/* If User Said "No", Select Error Type and Correction */}
      {userSaidCorrect === false && (
        <div className="flex flex-col gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl animate-fade-in">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Specify the Exact Error Type You Caught:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {errorTypes.map((err) => {
              const isSelected = selectedErrorType === err.type;
              return (
                <button
                  key={err.type}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onSelectErrorType(err.type);
                    sounds.playClick();
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 border-amber-300 font-bold ring-2 ring-amber-300 shadow'
                      : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                  }`}
                >
                  <span className="text-xs">{err.label}</span>
                  <span className={`text-[10px] leading-tight ${isSelected ? 'text-neutral-900' : 'text-neutral-400'}`}>
                    {err.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Correction Input */}
          <div className="mt-2 pt-3 border-t border-neutral-800 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              What is the Correct Answer / Label?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableLabels.map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => {
                    onChangeCorrectedAnswer(lbl);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    correctedAnswer === lbl
                      ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

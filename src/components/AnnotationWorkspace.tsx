import React, { useState } from 'react';
import { 
  Quest, 
  ChildProfile, 
  LanguageCode, 
  BoundingBox, 
  QAErrorType, 
  EvaluationResult 
} from '../types';
import { evaluateSubmission } from '../utils/scoring';
import { sounds } from '../utils/soundEffects';
import { getTranslation } from '../i18n/translations';
import { ImageAnnotator } from './ImageAnnotator';
import { TextAnnotator } from './TextAnnotator';
import { AudioAnnotator } from './AudioAnnotator';
import { VideoAnnotator } from './VideoAnnotator';
import { QAInspectorGame } from './QAInspectorGame';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Trophy, 
  Eye, 
  RotateCcw, 
  ArrowRight, 
  Bot, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnnotationWorkspaceProps {
  quest: Quest;
  profile: ChildProfile;
  language: LanguageCode;
  onBack: () => void;
  onQuestCompleted: (questId: string, result: EvaluationResult, xpEarned: number) => void;
  onOpenQuestBot: () => void;
  onTriggerFirstAha: () => void;
}

export const AnnotationWorkspace: React.FC<AnnotationWorkspaceProps> = ({
  quest,
  profile,
  language,
  onBack,
  onQuestCompleted,
  onOpenQuestBot,
  onTriggerFirstAha,
}) => {
  // State for different modalities
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [selectedSentiment, setSelectedSentiment] = useState<string>('');
  const [selectedSoundClass, setSelectedSoundClass] = useState<string>('');
  const [frameBoxes, setFrameBoxes] = useState<Record<number, BoundingBox>>({});
  
  // QA Inspector state
  const [userSaidCorrect, setUserSaidCorrect] = useState<boolean | null>(null);
  const [selectedErrorType, setSelectedErrorType] = useState<QAErrorType | undefined>(undefined);
  const [correctedAnswer, setCorrectedAnswer] = useState<string>('');

  // Submission & evaluation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [showGoldStandard, setShowGoldStandard] = useState(false);

  const handleSubmit = () => {
    // Validate that user entered something
    if (quest.annotation_type === 'IMAGE_BOUNDING_BOX' && boxes.length === 0) {
      alert('Please draw at least one bounding box around the object!');
      return;
    }
    if (quest.annotation_type === 'TEXT_SENTIMENT' && !selectedSentiment) {
      alert('Please select a sentiment category!');
      return;
    }
    if (quest.annotation_type === 'AUDIO_CLASSIFICATION' && !selectedSoundClass) {
      alert('Please select the sound event you heard!');
      return;
    }
    if (quest.annotation_type === 'VIDEO_TRACKING' && Object.keys(frameBoxes).length === 0) {
      alert('Please track the object in at least one frame!');
      return;
    }
    if (quest.annotation_type === 'QA_INSPECTION' && userSaidCorrect === null) {
      alert('Please indicate if the AI model is correct or made a mistake!');
      return;
    }

    setIsSubmitting(true);
    sounds.playClick();

    // Prepare submission payload
    const submission = {
      boxes: quest.annotation_type === 'IMAGE_BOUNDING_BOX' ? boxes : undefined,
      selectedLabel: quest.annotation_type === 'AUDIO_CLASSIFICATION' ? selectedSoundClass : undefined,
      sentiment: quest.annotation_type === 'TEXT_SENTIMENT' ? selectedSentiment : undefined,
      frameBoxes: quest.annotation_type === 'VIDEO_TRACKING' ? frameBoxes : undefined,
      userSaidCorrect: quest.annotation_type === 'QA_INSPECTION' ? userSaidCorrect ?? undefined : undefined,
      errorType: quest.annotation_type === 'QA_INSPECTION' ? selectedErrorType : undefined,
      correctedAnswer: quest.annotation_type === 'QA_INSPECTION' ? correctedAnswer : undefined,
    };

    const result = evaluateSubmission(quest, submission);
    setEvalResult(result);
    setIsSubmitting(false);

    if (result.passed) {
      sounds.playSuccessChime();
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10B981', '#F59E0B', '#3B82F6'],
        });
      } catch {}

      // If first quest completed ever, trigger the First Aha Modal!
      if (profile.completed_quests.length === 0) {
        setTimeout(() => {
          onTriggerFirstAha();
        }, 800);
      }
    } else {
      sounds.playErrorSoft();
    }
  };

  const handleNextQuest = () => {
    if (evalResult) {
      onQuestCompleted(quest.id, evalResult, evalResult.earnedXp);
    }
  };

  return (
    <div id="annotation-workspace" className="flex flex-col gap-5 max-w-5xl mx-auto w-full px-4 sm:px-6 py-4 animate-fade-in">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Level {quest.level} • {quest.dataset_context}
              </span>
            </div>
            <h2 className="text-base font-bold text-white leading-tight">{quest.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenQuestBot();
            }}
            className="px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-emerald-400 flex items-center gap-1.5 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Ask QuestBot</span>
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-xs font-bold text-emerald-300">
            +{quest.xp_reward} XP
          </div>
        </div>
      </div>

      {/* Quest Instructions & Goal Banner */}
      <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow">
        <div className="flex items-start gap-2.5">
          <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Quest Objective & AI Impact:
            </h4>
            <p className="text-xs text-neutral-200 mt-0.5 leading-relaxed">
              {quest.instructions || quest.instruction || quest.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Child-Safe Training Corpus</span>
        </div>
      </div>

      {/* Main Interactive Annotation Canvas Stage */}
      <div className="w-full">
        {(quest.annotation_type === 'IMAGE_BOUNDING_BOX' || quest.annotation_type === 'IMAGE') && (
          <ImageAnnotator
            imageUrl={quest.media_content?.image_url || quest.media_asset?.url}
            altText={quest.media_content?.alt_text || quest.media_asset?.alt || quest.title}
            availableLabels={quest.available_labels || quest.availableLabels || ['Object', 'Vehicle']}
            boxes={boxes}
            onChangeBoxes={setBoxes}
            groundTruthBoxes={quest.ground_truth?.boxes}
            showGroundTruth={showGoldStandard}
            disabled={!!evalResult && evalResult.passed}
          />
        )}

        {(quest.annotation_type === 'TEXT_SENTIMENT' || quest.annotation_type === 'TEXT') && (
          <TextAnnotator
            textContent={quest.media_content?.text_content || quest.media_asset?.textContent || ''}
            category={quest.dataset_context}
            selectedSentiment={selectedSentiment}
            onSelectSentiment={setSelectedSentiment}
            availableLabels={quest.available_labels || quest.availableLabels}
            disabled={!!evalResult && evalResult.passed}
          />
        )}

        {(quest.annotation_type === 'AUDIO_CLASSIFICATION' || quest.annotation_type === 'AUDIO') && (
          <AudioAnnotator
            audioSynthType={quest.media_content?.audio_synth_type || quest.media_asset?.audioSynthType}
            availableLabels={quest.available_labels || quest.availableLabels || ['Sound Event']}
            selectedSoundClass={selectedSoundClass}
            onSelectSoundClass={setSelectedSoundClass}
            altText={quest.media_content?.alt_text || quest.media_asset?.alt || 'African Acoustic Sound'}
            disabled={!!evalResult && evalResult.passed}
          />
        )}

        {(quest.annotation_type === 'VIDEO_TRACKING' || quest.annotation_type === 'VIDEO') && (
          <VideoAnnotator
            videoFrames={quest.media_content?.video_frames || quest.media_asset?.videoFrames}
            availableLabels={quest.available_labels || quest.availableLabels || ['Object']}
            frameBoxes={frameBoxes}
            onChangeFrameBox={(frameNum, box) => {
              setFrameBoxes(prev => ({ ...prev, [frameNum]: box }));
            }}
            disabled={!!evalResult && evalResult.passed}
          />
        )}

        {(quest.annotation_type === 'QA_INSPECTION' || quest.is_qa_mode || quest.ground_truth_qa || quest.ground_truth?.type === 'QA') && (
          <QAInspectorGame
            groundTruthQA={quest.ground_truth_qa || (quest.ground_truth as any)}
            userSaidCorrect={userSaidCorrect}
            onSetUserSaidCorrect={setUserSaidCorrect}
            selectedErrorType={selectedErrorType}
            onSelectErrorType={setSelectedErrorType}
            correctedAnswer={correctedAnswer}
            onChangeCorrectedAnswer={setCorrectedAnswer}
            availableLabels={quest.available_labels || quest.availableLabels}
            disabled={!!evalResult && evalResult.passed}
          />
        )}
      </div>

      {/* Action Footer (Submit / Reset / Feedback) */}
      {!evalResult ? (
        <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg">
          <button
            type="button"
            onClick={() => {
              setBoxes([]);
              setSelectedSentiment('');
              setSelectedSoundClass('');
              setFrameBoxes({});
              setUserSaidCorrect(null);
              setSelectedErrorType(undefined);
              setCorrectedAnswer('');
              sounds.playClick();
            }}
            className="px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Canvas</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="py-3 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm shadow-xl flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Check My Work</span>
          </button>
        </div>
      ) : (
        /* Evaluation Results Feedback Box */
        <div className={`p-6 rounded-3xl border shadow-2xl flex flex-col gap-4 animate-fade-in ${
          evalResult.passed
            ? 'bg-gradient-to-r from-emerald-950/80 via-neutral-900 to-neutral-900 border-emerald-500/50'
            : 'bg-gradient-to-r from-rose-950/80 via-neutral-900 to-neutral-900 border-rose-500/50'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                evalResult.passed ? 'bg-emerald-500 text-neutral-950' : 'bg-rose-500 text-white'
              }`}>
                {evalResult.passed ? '✓' : '!'}
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  {evalResult.passed ? 'Outstanding Work, Data Hero!' : 'Close! Let’s Refine This'}
                </h3>
                <p className="text-xs text-neutral-300">{evalResult.feedback}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Accuracy Score</span>
                <span className="text-lg font-mono font-black text-emerald-400">{evalResult.score}%</span>
              </div>
              {evalResult.passed && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                  +{evalResult.earnedXp} XP
                </div>
              )}
            </div>
          </div>

          {/* Educational Takeaway & Why It Matters */}
          <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl flex flex-col gap-1 text-xs">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Why This Teaches AI:
            </span>
            <p className="text-neutral-300 leading-relaxed">{evalResult.educationalTakeaway}</p>
          </div>

          {/* Comparison with Gold Standard Toggle */}
          {quest.ground_truth?.boxes && (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowGoldStandard(!showGoldStandard);
                  sounds.playClick();
                }}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>{showGoldStandard ? 'Hide Gold Standard' : 'Compare With Gold Standard'}</span>
              </button>

              <span className="text-[11px] text-neutral-400">
                {evalResult.iouScore ? `IoU Overlap: ${Math.round(evalResult.iouScore * 100)}%` : ''}
              </span>
            </div>
          )}

          {/* Action to proceed or retry */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
            {!evalResult.passed ? (
              <button
                type="button"
                onClick={() => {
                  setEvalResult(null);
                  sounds.playClick();
                }}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Try Again
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextQuest}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition-all transform active:scale-95"
              >
                <span>Continue Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

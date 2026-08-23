import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, RotateCcw, Activity, Music, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface AudioAnnotatorProps {
  audioSynthType?: string;
  availableLabels: string[];
  selectedSoundClass?: string;
  onSelectSoundClass: (label: string) => void;
  altText: string;
  disabled?: boolean;
}

export const AudioAnnotator: React.FC<AudioAnnotatorProps> = ({
  audioSynthType = 'rain',
  availableLabels,
  selectedSoundClass,
  onSelectSoundClass,
  altText,
  disabled = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const stopFnRef = useRef<(() => void) | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const startPlayback = () => {
    if (isPlaying) {
      if (stopFnRef.current) stopFnRef.current();
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    setIsPlaying(true);
    sounds.playClick();
    const durationSec = 3.0;
    const stopFn = sounds.playProceduralSound(audioSynthType, durationSec);
    stopFnRef.current = stopFn;

    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const pct = Math.min(100, (elapsed / durationSec) * 100);
      setProgress(pct);

      if (pct < 100) {
        animFrameRef.current = requestAnimationFrame(updateProgress);
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
    };
    animFrameRef.current = requestAnimationFrame(updateProgress);
  };

  useEffect(() => {
    return () => {
      if (stopFnRef.current) stopFnRef.current();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div id="audio-annotator-container" className="flex flex-col gap-4 w-full">
      {/* Audio Visualizer Stage */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl relative shadow-lg overflow-hidden flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Activity className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-neutral-200">{altText}</h4>
              <p className="text-xs text-neutral-400">Audio Frequency Waveform & Sound Event Detection</p>
            </div>
          </div>

          <button
            type="button"
            onClick={startPlayback}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
              isPlaying
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Stop Audio
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Listen to Audio
              </>
            )}
          </button>
        </div>

        {/* Animated Waveform Visualizer Bars */}
        <div className="h-24 bg-neutral-950 rounded-xl border border-neutral-800/80 p-3 flex items-center justify-between gap-1 overflow-hidden relative">
          {Array.from({ length: 36 }).map((_, i) => {
            const heightMultiplier = Math.sin((i / 36) * Math.PI) * 0.8 + 0.2;
            const dynamicHeight = isPlaying 
              ? Math.max(15, Math.sin(Date.now() / 150 + i) * 45 + 50) * heightMultiplier
              : heightMultiplier * 40;

            return (
              <div
                key={i}
                style={{ height: `${dynamicHeight}%` }}
                className={`w-full rounded-full transition-all duration-100 ${
                  isPlaying ? 'bg-gradient-to-t from-emerald-500 to-amber-400' : 'bg-neutral-700'
                }`}
              />
            );
          })}

          {/* Scrubber Progress Bar */}
          <div
            style={{ width: `${progress}%` }}
            className="absolute bottom-0 left-0 h-1 bg-emerald-400 transition-all"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>🔊 Synthesizer: 44.1kHz PCM Procedural Audio</span>
          <span>Status: {isPlaying ? 'Playing Sound...' : 'Ready to Analyze'}</span>
        </div>
      </div>

      {/* Acoustic Classification Selector */}
      <div className="flex flex-col gap-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          Which Sound Event Did You Hear?
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {availableLabels.map((lbl) => {
            const isSelected = selectedSoundClass === lbl;
            return (
              <button
                key={lbl}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onSelectSoundClass(lbl);
                  sounds.playClick();
                }}
                className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                } ${disabled ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                <Music className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                <span>{lbl}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-200" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

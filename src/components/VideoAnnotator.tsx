import React, { useState } from 'react';
import { BoundingBox } from '../types';
import { Film, Play, Pause, ChevronLeft, ChevronRight, CheckCircle2, Crosshair, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface VideoAnnotatorProps {
  videoFrames?: string[];
  availableLabels: string[];
  frameBoxes: Record<number, BoundingBox>;
  onChangeFrameBox: (frameNum: number, box: BoundingBox) => void;
  disabled?: boolean;
}

export const VideoAnnotator: React.FC<VideoAnnotatorProps> = ({
  videoFrames = [
    'Frame 1: Object starts on the left lane (Time: 0.0s)',
    'Frame 2: Object accelerates across center (Time: 1.0s)',
    'Frame 3: Object approaches destination on the right (Time: 2.0s)',
  ],
  availableLabels,
  frameBoxes,
  onChangeFrameBox,
  disabled = false,
}) => {
  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(1);
  const totalFrames = videoFrames.length;
  const [selectedLabel, setSelectedLabel] = useState<string>(availableLabels[0] || 'Object');

  // Track dragging on current frame
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [tempBox, setTempBox] = useState<BoundingBox | null>(null);

  const currentBox = frameBoxes[currentFrameIdx];

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setIsDrawing(true);
    setStartPos({ x, y });
    setTempBox({
      id: `vbox_${currentFrameIdx}_${Date.now()}`,
      x,
      y,
      width: 0,
      height: 0,
      label: selectedLabel,
    });
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !startPos) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const minX = Math.min(startPos.x, x);
    const minY = Math.min(startPos.y, y);
    const width = Math.abs(x - startPos.x);
    const height = Math.abs(y - startPos.y);

    setTempBox({
      id: tempBox?.id || `vbox_${currentFrameIdx}_${Date.now()}`,
      x: minX,
      y: minY,
      width,
      height,
      label: selectedLabel,
    });
  };

  const handlePointerUp = () => {
    if (isDrawing && tempBox && tempBox.width > 0.03 && tempBox.height > 0.03) {
      onChangeFrameBox(currentFrameIdx, tempBox);
      sounds.playClick();
    }
    setIsDrawing(false);
    setStartPos(null);
    setTempBox(null);
  };

  return (
    <div id="video-annotator-container" className="flex flex-col gap-4 w-full">
      {/* Frame Timeline Header */}
      <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Film className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-neutral-200">
            Temporal Video Sequence: Frame {currentFrameIdx} of {totalFrames}
          </span>
        </div>

        {/* Frame Jump Steppers */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentFrameIdx <= 1}
            onClick={() => {
              setCurrentFrameIdx(p => Math.max(1, p - 1));
              sounds.playClick();
            }}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white transition-all text-xs flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          {Array.from({ length: totalFrames }).map((_, i) => {
            const frameNum = i + 1;
            const hasBox = !!frameBoxes[frameNum];
            const isCurrent = currentFrameIdx === frameNum;

            return (
              <button
                key={frameNum}
                type="button"
                onClick={() => {
                  setCurrentFrameIdx(frameNum);
                  sounds.playClick();
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all relative ${
                  isCurrent
                    ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                    : hasBox
                    ? 'bg-emerald-700/80 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {frameNum}
                {hasBox && !isCurrent && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentFrameIdx >= totalFrames}
            onClick={() => {
              setCurrentFrameIdx(p => Math.min(totalFrames, p + 1));
              sounds.playClick();
            }}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white transition-all text-xs flex items-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Visual Stage */}
      <div
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        className="relative w-full aspect-[4/3] max-h-[460px] bg-neutral-950 rounded-2xl overflow-hidden border-2 border-neutral-800 select-none cursor-crosshair shadow-inner flex flex-col justify-between p-6"
      >
        {/* Frame Description Header Overlay */}
        <div className="bg-neutral-900/80 backdrop-blur border border-neutral-800 px-3.5 py-2 rounded-xl text-xs text-neutral-200 shadow self-start pointer-events-none flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{videoFrames[currentFrameIdx - 1] || `Frame ${currentFrameIdx}`}</span>
        </div>

        {/* Trajectory Ghost Trail across frames */}
        <div className="absolute inset-0 pointer-events-none">
          {Object.entries(frameBoxes).map(([fNum, b]) => {
            const box = b as BoundingBox;
            const num = parseInt(fNum);
            const isCurrent = num === currentFrameIdx;
            if (isCurrent || !box) return null;

            return (
              <div
                key={`ghost_${fNum}`}
                style={{
                  left: `${box.x * 100}%`,
                  top: `${box.y * 100}%`,
                  width: `${box.width * 100}%`,
                  height: `${box.height * 100}%`,
                }}
                className="absolute border border-dashed border-purple-400/30 bg-purple-500/5 rounded"
              >
                <span className="absolute -top-4 left-0 text-[9px] font-mono text-purple-400/60">
                  F{num}
                </span>
              </div>
            );
          })}
        </div>

        {/* Active Frame Box */}
        {currentBox && (
          <div
            style={{
              left: `${currentBox.x * 100}%`,
              top: `${currentBox.y * 100}%`,
              width: `${currentBox.width * 100}%`,
              height: `${currentBox.height * 100}%`,
            }}
            className="absolute border-2 border-purple-500 bg-purple-500/20 rounded shadow-lg z-20"
          >
            <div className="absolute -top-6 left-0 bg-purple-600 text-white font-bold px-2 py-0.5 rounded text-[10px] shadow whitespace-nowrap">
              Frame {currentFrameIdx}: {currentBox.label}
            </div>
          </div>
        )}

        {/* Temporary Dragging Box */}
        {tempBox && (
          <div
            style={{
              left: `${tempBox.x * 100}%`,
              top: `${tempBox.y * 100}%`,
              width: `${tempBox.width * 100}%`,
              height: `${tempBox.height * 100}%`,
            }}
            className="absolute border-2 border-dashed border-purple-400 bg-purple-400/25 rounded z-30 pointer-events-none"
          />
        )}

        {/* Prompt Cue at bottom */}
        <div className="bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-xl text-[11px] text-neutral-300 self-center pointer-events-none">
          {currentBox
            ? `✅ Frame ${currentFrameIdx} tracked! Move to the next frame to continue the trajectory.`
            : `👉 Click and drag a box around the object at Frame ${currentFrameIdx}`}
        </div>
      </div>
    </div>
  );
};

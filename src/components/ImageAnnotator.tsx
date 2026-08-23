import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BoundingBox } from '../types';
import { Trash2, Move, Plus, Tag, Check, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ImageAnnotatorProps {
  imageUrl?: string;
  altText: string;
  availableLabels: string[];
  boxes: BoundingBox[];
  onChangeBoxes: (boxes: BoundingBox[]) => void;
  groundTruthBoxes?: BoundingBox[];
  showGroundTruth?: boolean;
  disabled?: boolean;
}

export const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({
  imageUrl,
  altText,
  availableLabels,
  boxes,
  onChangeBoxes,
  groundTruthBoxes = [],
  showGroundTruth = false,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(availableLabels[0] || 'Object');
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentDragBox, setCurrentDragBox] = useState<BoundingBox | null>(null);

  // Moving existing box
  const [isMoving, setIsMoving] = useState(false);
  const [moveStart, setMoveStart] = useState<{ x: number; y: number; boxOrigX: number; boxOrigY: number } | null>(null);

  // Fallback placeholder image with rich stylized canvas if image fails to load
  const [imageError, setImageError] = useState(false);

  // Color palette for labels
  const labelColors = [
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
  ];

  const getLabelColor = (label: string) => {
    const idx = availableLabels.indexOf(label);
    return idx >= 0 ? labelColors[idx % labelColors.length] : '#10B981';
  };

  const getNormalizedCoords = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    return { x, y };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    
    // Check if clicked inside an existing box
    const { x, y } = getNormalizedCoords(e);
    const clickedBox = [...boxes].reverse().find(b => 
      x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height
    );

    if (clickedBox && e.type === 'mousedown' && (e as React.MouseEvent).shiftKey) {
      // Shift+Click to move
      setSelectedBoxId(clickedBox.id);
      setIsMoving(true);
      setMoveStart({ x, y, boxOrigX: clickedBox.x, boxOrigY: clickedBox.y });
      return;
    }

    if (clickedBox && !isDrawing) {
      setSelectedBoxId(clickedBox.id);
      sounds.playClick();
      return;
    }

    // Start drawing new box
    setSelectedBoxId(null);
    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentDragBox({
      id: `box_${Date.now()}`,
      x,
      y,
      width: 0,
      height: 0,
      label: selectedLabel,
      color: getLabelColor(selectedLabel),
    });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    const { x, y } = getNormalizedCoords(e);

    if (isMoving && moveStart && selectedBoxId) {
      const dx = x - moveStart.x;
      const dy = y - moveStart.y;
      onChangeBoxes(boxes.map(b => {
        if (b.id === selectedBoxId) {
          const newX = Math.max(0, Math.min(1 - b.width, moveStart.boxOrigX + dx));
          const newY = Math.max(0, Math.min(1 - b.height, moveStart.boxOrigY + dy));
          return { ...b, x: newX, y: newY };
        }
        return b;
      }));
      return;
    }

    if (isDrawing && startPos) {
      const minX = Math.min(startPos.x, x);
      const minY = Math.min(startPos.y, y);
      const width = Math.abs(x - startPos.x);
      const height = Math.abs(y - startPos.y);

      setCurrentDragBox({
        id: currentDragBox?.id || `box_${Date.now()}`,
        x: minX,
        y: minY,
        width,
        height,
        label: selectedLabel,
        color: getLabelColor(selectedLabel),
      });
    }
  };

  const handlePointerUp = () => {
    if (isMoving) {
      setIsMoving(false);
      setMoveStart(null);
      return;
    }

    if (isDrawing && currentDragBox) {
      // Only keep boxes with significant size (> 3% width & height)
      if (currentDragBox.width > 0.03 && currentDragBox.height > 0.03) {
        onChangeBoxes([...boxes, currentDragBox]);
        setSelectedBoxId(currentDragBox.id);
        sounds.playClick();
      }
      setIsDrawing(false);
      setStartPos(null);
      setCurrentDragBox(null);
    }
  };

  const handleDeleteBox = (id: string) => {
    onChangeBoxes(boxes.filter(b => b.id !== id));
    if (selectedBoxId === id) setSelectedBoxId(null);
    sounds.playClick();
  };

  const handleUpdateBoxLabel = (id: string, newLabel: string) => {
    onChangeBoxes(boxes.map(b => b.id === id ? { ...b, label: newLabel, color: getLabelColor(newLabel) } : b));
    sounds.playClick();
  };

  return (
    <div id="image-annotator-container" className="flex flex-col gap-3 w-full">
      {/* Label Palette & Control Bar */}
      {!disabled && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-neutral-900/90 text-white rounded-xl border border-neutral-800 shadow-md">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1 pl-1">
              <Tag className="w-3.5 h-3.5 text-emerald-400" /> Active Label:
            </span>
            {availableLabels.map((lbl) => {
              const isSelected = selectedLabel === lbl;
              const color = getLabelColor(lbl);
              return (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => {
                    setSelectedLabel(lbl);
                    if (selectedBoxId) handleUpdateBoxLabel(selectedBoxId, lbl);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: color }}
                  />
                  {lbl}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {selectedBoxId && (
              <button
                type="button"
                onClick={() => handleDeleteBox(selectedBoxId)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                title="Delete Selected Box"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Box
              </button>
            )}
            <span className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-300">
              {boxes.length} {boxes.length === 1 ? 'Box' : 'Boxes'} Drawn
            </span>
          </div>
        </div>
      )}

      {/* Interactive Drawing Canvas Area */}
      <div
        ref={containerRef}
        id="annotation-canvas-stage"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className={`relative w-full aspect-[4/3] max-h-[500px] bg-neutral-950 rounded-2xl overflow-hidden border-2 select-none touch-none cursor-crosshair transition-all ${
          isDrawing ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-neutral-800'
        }`}
      >
        {/* Real image with fallback visual */}
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={altText}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-950 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3 border border-emerald-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-semibold text-neutral-200 mb-1">{altText}</h4>
            <p className="text-xs text-neutral-400 max-w-sm">
              Real-world African AI dataset asset. Click and drag to create your precision bounding box annotations.
            </p>
          </div>
        )}

        {/* Drawn User Bounding Boxes */}
        {boxes.map((box) => {
          const isSelected = selectedBoxId === box.id;
          const boxColor = box.color || getLabelColor(box.label);

          return (
            <div
              key={box.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBoxId(box.id);
                sounds.playClick();
              }}
              style={{
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.width * 100}%`,
                height: `${box.height * 100}%`,
                borderColor: boxColor,
                backgroundColor: `${boxColor}22`,
              }}
              className={`absolute border-2 transition-transform cursor-pointer group ${
                isSelected ? 'ring-2 ring-white shadow-lg z-20' : 'z-10'
              }`}
            >
              {/* Label Tag Badge */}
              <div
                style={{ backgroundColor: boxColor }}
                className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold text-white tracking-wide shadow whitespace-nowrap flex items-center gap-1 pointer-events-none"
              >
                <span>{box.label}</span>
              </div>

              {/* Corner handles for selected box */}
              {isSelected && !disabled && (
                <>
                  <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border border-neutral-900 rounded-sm" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border border-neutral-900 rounded-sm" />
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border border-neutral-900 rounded-sm" />
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border border-neutral-900 rounded-sm" />
                </>
              )}
            </div>
          );
        })}

        {/* Currently Dragging Active Box */}
        {currentDragBox && (
          <div
            style={{
              left: `${currentDragBox.x * 100}%`,
              top: `${currentDragBox.y * 100}%`,
              width: `${currentDragBox.width * 100}%`,
              height: `${currentDragBox.height * 100}%`,
              borderColor: currentDragBox.color || '#10B981',
              backgroundColor: `${currentDragBox.color || '#10B981'}33`,
            }}
            className="absolute border-2 border-dashed z-30 pointer-events-none"
          >
            <div
              style={{ backgroundColor: currentDragBox.color || '#10B981' }}
              className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow whitespace-nowrap"
            >
              {currentDragBox.label}
            </div>
          </div>
        )}

        {/* Ground Truth Comparison Overlay (Gold Standard) */}
        {showGroundTruth && groundTruthBoxes.map((gt, idx) => (
          <div
            key={`gt_${idx}`}
            style={{
              left: `${gt.x * 100}%`,
              top: `${gt.y * 100}%`,
              width: `${gt.width * 100}%`,
              height: `${gt.height * 100}%`,
            }}
            className="absolute border-2 border-dashed border-amber-400 bg-amber-400/15 z-25 pointer-events-none"
          >
            <div className="absolute -bottom-6 left-0 bg-amber-500 text-neutral-950 font-bold px-2 py-0.5 rounded text-[10px] shadow">
              ⭐ Gold Standard: {gt.label}
            </div>
          </div>
        ))}
      </div>

      {/* Helper Guidance Tip */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <span>💡 <strong>Tip:</strong> Click & drag to draw. Click a box to select or delete.</span>
        <span>Coordinates: Normalized [0, 1] System</span>
      </div>
    </div>
  );
};

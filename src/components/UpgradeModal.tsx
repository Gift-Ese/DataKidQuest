import React, { useState } from 'react';
import { Crown, Sparkles, CheckCircle2, X, Shield, ArrowRight, CreditCard } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface UpgradeModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    sounds.playClick();

    setTimeout(() => {
      setIsProcessing(false);
      sounds.playFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6'],
        });
      } catch {}
      onSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fade-in text-white">
      <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Crown Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4 shadow-lg">
          <Crown className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-white tracking-tight">
          Unlock Full AI Specialist Track
        </h3>
        <p className="text-xs text-neutral-300 mt-1">
          Unlocks all Levels 2, 3, 4, and 5 for a single affordable 3-month pass.
        </p>

        {/* Pricing Card */}
        <div className="my-5 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              3-Month Full Access
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              ₦5,000 <span className="text-xs font-normal text-neutral-400">/ 3 Months</span>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
            Only ~₦1,660/mo
          </span>
        </div>

        {/* Feature List */}
        <div className="flex flex-col gap-2.5 mb-6 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Level 2:</strong> Multi-instance precision bounding boxes & dialects</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Level 3:</strong> Quality Assurance & IoU calibration inspector</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Level 4:</strong> &quot;Catch the AI&quot; game & bias evaluation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Level 5:</strong> Dataset Governance & official certificate</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
        >
          {isProcessing ? (
            <span>Activating Full Access...</span>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Unlock Now (₦5,000)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
